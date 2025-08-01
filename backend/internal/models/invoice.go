package models

import (
	"database/sql"
	"time"
)

// InvoiceItem represents an item in an invoice.
type InvoiceItem struct {
	ItemID   int     `json:"item_id"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
}

// Invoice represents a customer invoice.
type Invoice struct {
	ID           int           `json:"id"`
	CustomerName string        `json:"customer_name"`
	Items        []InvoiceItem `json:"items"`
	Tax          float64       `json:"tax"`
	Total        float64       `json:"total"`
	CreatedAt    time.Time     `json:"created_at"`
}

// InvoiceModel handles database operations for invoices.
type InvoiceModel struct {
	DB *sql.DB
}

// NewInvoiceModel initializes InvoiceModel with a database connection.
func NewInvoiceModel(db *sql.DB) *InvoiceModel {
	return &InvoiceModel{DB: db}
}

// adds a new invoice to the database, calculating total automatically.
func (m *InvoiceModel) CreateInvoice(invoice *Invoice) error {
	tx, err := m.DB.Begin()
	if err != nil {
		return err
	}

	// Calculate total from items and tax
	itemsTotal := 0.0
	for _, item := range invoice.Items {
		itemsTotal += float64(item.Quantity) * item.Price
	}

	// Calculate tax as percentage of items total
	taxAmount := itemsTotal * (invoice.Tax / 100.0)
	total := itemsTotal + taxAmount
	createdAt := time.Now()

	// Insert invoice with current timestamp
	query := `INSERT INTO invoices (customer_name, tax, total, created_at) VALUES ($1, $2, $3, $4) RETURNING id`
	err = tx.QueryRow(query, invoice.CustomerName, invoice.Tax, total, createdAt).Scan(&invoice.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Insert invoice items
	for _, item := range invoice.Items {
		query := `INSERT INTO invoice_items (invoice_id, item_id, quantity, price) VALUES ($1, $2, $3, $4)`
		_, err := tx.Exec(query, invoice.ID, item.ItemID, item.Quantity, item.Price)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	// Set calculated fields on the struct
	invoice.Total = total
	invoice.CreatedAt = createdAt

	return tx.Commit()
}

// retrieves an invoice by its ID from the database.
func (m *InvoiceModel) GetInvoiceByID(id int) (*Invoice, error) {
	// Query the invoice details from the invoices table
	query := `SELECT id, customer_name, tax, total, created_at FROM invoices WHERE id = $1`
	var invoice Invoice
	err := m.DB.QueryRow(query, id).Scan(&invoice.ID, &invoice.CustomerName, &invoice.Tax, &invoice.Total, &invoice.CreatedAt)
	if err != nil {
		return nil, err
	}

	// Query all items associated with the invoice from the invoice_items table
	itemsQuery := `SELECT item_id, quantity, price FROM invoice_items WHERE invoice_id = $1`
	rows, err := m.DB.Query(itemsQuery, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Iterate over the result rows, scanning each row into an InvoiceItem and appending it to the items slice
	var items []InvoiceItem
	for rows.Next() {
		var item InvoiceItem
		if err := rows.Scan(&item.ItemID, &item.Quantity, &item.Price); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	// Assign the collected items to the invoice struct
	invoice.Items = items
	return &invoice, nil
}

// retrieves a paginated list of invoices with their items.
func (m *InvoiceModel) GetInvoicesPaginated(offset int) ([]Invoice, error) {
	const limit = 5
	query := `SELECT id, customer_name, tax, total, created_at FROM invoices ORDER BY id LIMIT $1 OFFSET $2`
	rows, err := m.DB.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var invoices []Invoice
	for rows.Next() {
		var invoice Invoice
		if err := rows.Scan(&invoice.ID, &invoice.CustomerName, &invoice.Tax, &invoice.Total, &invoice.CreatedAt); err != nil {
			return nil, err
		}

		// Fetch items for each invoice
		itemsQuery := `SELECT item_id, quantity, price FROM invoice_items WHERE invoice_id = $1`
		itemRows, err := m.DB.Query(itemsQuery, invoice.ID)
		if err != nil {
			return nil, err
		}
		var items []InvoiceItem
		for itemRows.Next() {
			var item InvoiceItem
			if err := itemRows.Scan(&item.ItemID, &item.Quantity, &item.Price); err != nil {
				itemRows.Close()
				return nil, err
			}
			items = append(items, item)
		}
		itemRows.Close()
		invoice.Items = items

		invoices = append(invoices, invoice)
	}

	return invoices, nil
}
