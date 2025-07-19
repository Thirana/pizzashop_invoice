package main

import (
	"database/sql"
	"log"
	"pizza-shop-backend/internal/controllers"
	"pizza-shop-backend/internal/models"

	"github.com/gin-contrib/cors"
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
	invoiceModel := models.NewInvoiceModel(db)
	invoiceController := controllers.NewInvoiceController(invoiceModel)

	// Set up Gin router
	r := gin.Default()

	// Configure CORS for Next.js frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60, // 12 hours
	}))

	// Item routes
	r.POST("/v1/items", itemController.CreateItemHandler)
	r.GET("/v1/items", itemController.GetItemsHandler)
	r.PUT("/v1/items/:id", itemController.UpdateItemHandler)
	r.DELETE("/v1/items/:id", itemController.DeleteItemHandler)

	// Invoice routes
	r.POST("/v1/invoices", invoiceController.CreateInvoiceHandler)
	r.GET("/v1/invoices/:id", invoiceController.GetInvoiceByIDHandler)

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
