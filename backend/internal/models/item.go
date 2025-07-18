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

// CreateItem adds a new item to the database.
func (m *ItemModel) CreateItem(item Item) error {
	query := `INSERT INTO items (name, type, price, description) VALUES ($1, $2, $3, $4) RETURNING id`
	return m.DB.QueryRow(query, item.Name, item.Type, item.Price, item.Description).Scan(&item.ID)
}

// GetItems retrieves all items from the database.
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
