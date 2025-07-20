package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"pizza-shop-backend/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

// InvoiceController handles HTTP requests for invoices.
type InvoiceController struct {
	Model *models.InvoiceModel
}

// NewInvoiceController initializes InvoiceController.
func NewInvoiceController(model *models.InvoiceModel) *InvoiceController {
	return &InvoiceController{Model: model}
}

// handles POST /invoices.
func (c *InvoiceController) CreateInvoiceHandler(ctx *gin.Context) {
	var invoice models.Invoice
	if err := ctx.ShouldBindJSON(&invoice); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.Model.CreateInvoice(&invoice); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Fetch the full invoice from DB to get all fields (ID, total, created_at)
	fullInvoice, err := c.Model.GetInvoiceByID(invoice.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, fullInvoice)
}

// handles GET /invoices/:id.
func (c *InvoiceController) GetInvoiceByIDHandler(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invoice ID is required"})
		return
	}

	// Convert string ID to int
	var invoiceID int
	if _, err := fmt.Sscanf(id, "%d", &invoiceID); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid invoice ID format"})
		return
	}

	invoice, err := c.Model.GetInvoiceByID(invoiceID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "invoice not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, invoice)
}

// handles GET /invoices with pagination.
func (c *InvoiceController) GetInvoicesPaginatedHandler(ctx *gin.Context) {
	page := 1
	if p := ctx.Query("page"); p != "" {
		if n, err := strconv.Atoi(p); err == nil && n > 0 {
			page = n
		}
	}
	offset := (page - 1) * 3
	invoices, err := c.Model.GetInvoicesPaginated(offset)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, invoices)
}
