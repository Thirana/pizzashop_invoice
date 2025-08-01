package controllers

import (
	"net/http"
	"pizza-shop-backend/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ItemController struct {
	Model *models.ItemModel
}

func NewItemController(model *models.ItemModel) *ItemController {
	return &ItemController{Model: model}
}

// handles POST /items.
func (c *ItemController) CreateItemHandler(ctx *gin.Context) {
	var item models.Item
	if err := ctx.ShouldBindJSON(&item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.Model.CreateItem(item); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, item)
}

// handles GET /items.
func (c *ItemController) GetItemsHandler(ctx *gin.Context) {
	items, err := c.Model.GetItems()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, items)
}

// handles GET /items/paginated.
func (c *ItemController) GetItemsPaginatedHandler(ctx *gin.Context) {
	page := 1
	if p := ctx.Query("page"); p != "" {
		if n, err := strconv.Atoi(p); err == nil && n > 0 {
			page = n
		}
	}
	items, err := c.Model.GetItemsPaginated(page)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, items)
}

// handles PUT /items/:id.
func (c *ItemController) UpdateItemHandler(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}
	var item models.Item
	if err := ctx.ShouldBindJSON(&item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	item.ID = id
	if err := c.Model.UpdateItem(item); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, item)
}

// handles DELETE /items/:id.
func (c *ItemController) DeleteItemHandler(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}
	if err := c.Model.DeleteItem(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Item deleted"})
}
