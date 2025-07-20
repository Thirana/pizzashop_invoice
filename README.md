# Puzzle Pizza

A modern, full-stack pizza shop invoice management system built with Go and Next.js. This application provides a comprehensive solution for managing invoices, and shop items with a easy to use user interface.

## Features

- **Invoice Management**: Create, view, and manage customer invoices
- **Item Management**: Add, edit, and track shop items
- **Print Functionality**: Generate and print professional invoices
- **Real-time Updates**: Instant data synchronization


## Tech Stack

### Backend
- **Language**: Go 1.24.5
- **Framework**: Gin (HTTP web framework)
- **Database**: PostgreSQL
- **ORM**: Native SQL with `lib/pq` driver
- **Containerization**: Docker & Docker Compose
- **CORS**: Cross-origin resource sharing enabled

### Frontend
- **Framework**: Next.js 15.4.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4


## 📋 Prerequisites

Before setting up the project, ensure you have the following installed on your system:

### Required Dependencies
- **Docker** (v20.10+) - [Download here](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0+) - Usually included with Docker Desktop
- **Node.js** (v18+) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package managers for Node.js

### Optional Dependencies
- **Git** - For version control
- **Go** (v1.24+) - [Download here](https://golang.org/dl/) - Only needed for backend development. Not required to run the backend
- **PostgreSQL** (if running locally without Docker)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Thirana/pizzashop_invoice.git
cd pizzashop_invoice
```

### 2. Backend Setup

The backend uses Docker Compose to manage both the API and database services.

```bash
# Navigate to backend directory
cd backend

# Start the backend services (API + PostgreSQL)
docker-compose up -d

# Verify services are running
docker-compose ps
```

The backend will be available at:
- **API**: http://localhost:8080
- **Database**: localhost:5432

The database will be automatically initialized with the schema defined in `backend/init.sql` when the Docker container starts.

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at:
- **Application**: http://localhost:3000





## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**: Ensure ports 3000, 8080, and 5432 are available
2. **Docker permission issues**: Add your user to the docker group or run with sudo
3. **Database connection errors**: Wait for PostgreSQL to fully start (usually 10-15 seconds)

### Logs and Debugging

```bash
# View backend logs
docker-compose logs api

# View database logs
docker-compose logs postgres

# Access database directly
docker-compose exec postgres psql -U user -d pizzadb
```
