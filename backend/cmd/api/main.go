package api

import (
	"database/sql"
	"log"
	"pizza-shop-backend/internal/controllers"
	"pizza-shop-backend/internal/models"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// Database connection
	connStr := "postgres://user:password@postgres:5432/pizzadb?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialize models and controllers
	itemModel := models.NewItemModel(db)
	itemController := controllers.NewItemController(itemModel)

	// Set up Gin router
	r := gin.Default()

	// Item routes
	r.POST("/items", itemController.CreateItemHandler)
	r.GET("/items", itemController.GetItemsHandler)

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
