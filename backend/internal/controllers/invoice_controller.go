package controllers

import (
	"net/http"
	"pizza-shop-backend/internal/models"

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

// CreateInvoiceHandler handles POST /invoices.
func (c *InvoiceController) CreateInvoiceHandler(ctx *gin.Context) {
	var invoice models.Invoice
	if err := ctx.ShouldBindJSON(&invoice); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.Model.CreateInvoice(invoice); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, invoice)
}
