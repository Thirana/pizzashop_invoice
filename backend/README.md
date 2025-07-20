# Backend API Documentation

## Overview

The backend is built using **Go** with a clean **MVC (Model-View-Controller)** architecture pattern. It provides a RESTful API for the Puzzle Pizza invoice management system, handling both items and invoices with proper database persistence using PostgreSQL.

## Architecture

### MVC Pattern Implementation

The backend follows the **Model-View-Controller** pattern with clear separation of concerns:

- **Models** (`internal/models/`): Handle data structure and database operations
- **Controllers** (`internal/controllers/`): Handle HTTP requests and business logic
- **Views**: JSON responses 


### Key Components

1. **Gin Framework**: High-performance HTTP web framework for routing and middleware
2. **PostgreSQL**: Relational database for data persistence
3. **CORS**: Enables cross-origin requests from the frontend
4. **Docker**: Containerization for easy deployment and development

## Database Structure

### Tables Overview

The database consists of three main tables with proper relationships:

1. **`items`** - Product catalog
2. **`invoices`** - Customer invoices
3. **`invoice_items`** - Junction table linking invoices to items

### Table Details

#### 1. Items Table

```sql
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT
);
```

**Fields:**
- `id` (SERIAL PRIMARY KEY): Auto incrementing unique identifier
- `name` (VARCHAR(100)): Product name (e.g., "Margherita Pizza - Large")
- `type` (VARCHAR(50)): Product category (pizza, beverage, dessert, topping)
- `price` (DECIMAL(10,2)): Product price with 2 decimal places
- `description` (TEXT): Optional product description


#### 2. Invoices Table

```sql
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `customer_name` (VARCHAR(100)): Customer's name
- `tax` (DECIMAL(10,2)): Tax percentage applied to the invoice
- `total` (DECIMAL(10,2)): Total amount including tax
- `created_at` (TIMESTAMP): Invoice creation timestamp

#### 3. Invoice Items Table (Junction Table)

```sql
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `invoice_id` (INT): Foreign key referencing invoices.id
- `item_id` (INT): Foreign key referencing items.id
- `quantity` (INT): Number of items ordered
- `price` (DECIMAL(10,2)): Price per item at time of order

### Relationships

1. **One-to-Many**: `invoices` → `invoice_items` (one invoice can have multiple items)
2. **Many-to-One**: `invoice_items` → `items` (multiple invoice items can reference the same item)
3. **Cascade Delete**: When an invoice is deleted, all related `invoice_items` entries for that invoice are automatically deleted.
4. **Cascade Delete**: When an item is deleted, all `invoice_items` entries that include that item are automatically deleted.

## API Endpoints

### Items Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/items` | Create a new item |
| `GET` | `/v1/items` | Get all items |
| `GET` | `/v1/items/paginated` | Get paginated items (10 per page) |
| `PUT` | `/v1/items/:id` | Update an existing item |
| `DELETE` | `/v1/items/:id` | Delete an item |

### Invoices Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/invoices` | Create a new invoice |
| `GET` | `/v1/invoices` | Get paginated invoices (5 per page) |
| `GET` | `/v1/invoices/:id` | Get invoice by ID with items |


## Invoice Creation Process

### 1. Page Initialization
- System loads available items from database
- User interface prepares form components
- Error handling for failed data retrieval

### 2. Form Processing
- User enters customer name and tax percentage
- Items are selected from dropdown with quantities specified
- System captures item prices at selection time
- Real time calculation of subtotal, tax, and total amounts
- Form validation ensures required fields and valid quantities

### 3. Data Transmission
- Form data is packaged into JSON format
- HTTP POST request sent to backend API endpoint
- Request includes customer information, tax rate, and item details

### 4. Server Processing
- Backend validates incoming data format
- Business logic recalculates totals for accuracy
- Database transaction creates invoice record
- Invoice items are stored with captured prices
- Transaction ensures data integrity

### 5. Database Storage
- `invoices` table stores customer name, tax rate, total, and timestamp
- `invoice_items` table stores item references, quantities, and prices
- Foreign key relationships maintain data consistency

### 6. Response Handling
- Server returns complete invoice with generated ID
- Frontend displays success message and invoice preview
- Print functionality becomes available
- Option to create additional invoices

### Key Features
- **Price Preservation**: Item prices captured at selection time
- **Transaction Safety**: Atomic database operations prevent data corruption
- **Real time Feedback**: Immediate calculations and validation
- **Error Recovery**: Graceful handling of network and validation errors





