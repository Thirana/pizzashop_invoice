package models

import (
	"database/sql"
)

type Item struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Type        string  `json:"type"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
}

type ItemModel struct {
	DB *sql.DB
}

func NewItemModel(db *sql.DB) *ItemModel {
	return &ItemModel{DB: db}
}

// adds a new item to the database.
func (m *ItemModel) CreateItem(item Item) error {
	query := `INSERT INTO items (name, type, price, description) VALUES ($1, $2, $3, $4) RETURNING id`
	return m.DB.QueryRow(query, item.Name, item.Type, item.Price, item.Description).Scan(&item.ID)
}

// retrieves all items from the database.
func (m *ItemModel) GetItems() ([]Item, error) {
	query := `SELECT id, name, type, price, description FROM items`
	rows, err := m.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Item
	for rows.Next() {
		var item Item
		if err := rows.Scan(&item.ID, &item.Name, &item.Type, &item.Price, &item.Description); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

// retrieves items from the database with pagination.
func (m *ItemModel) GetItemsPaginated(page int) ([]Item, error) {
	const limit = 10
	offset := (page - 1) * limit
	query := `SELECT id, name, type, price, description FROM items ORDER BY id LIMIT $1 OFFSET $2`
	rows, err := m.DB.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Item
	for rows.Next() {
		var item Item
		if err := rows.Scan(&item.ID, &item.Name, &item.Type, &item.Price, &item.Description); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

// updates an existing item in the database.
func (m *ItemModel) UpdateItem(item Item) error {
	query := `UPDATE items SET name=$1, type=$2, price=$3, description=$4 WHERE id=$5`
	_, err := m.DB.Exec(query, item.Name, item.Type, item.Price, item.Description, item.ID)
	return err
}

// deletes an item from the database by ID.
func (m *ItemModel) DeleteItem(id int) error {
	query := `DELETE FROM items WHERE id=$1`
	_, err := m.DB.Exec(query, id)
	return err
}
