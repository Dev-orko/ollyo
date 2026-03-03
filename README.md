# Business Management System

A production-ready web-based Business Management System built with Node.js, Express, PostgreSQL, Prisma, React, and Tailwind CSS — designed to replace a legacy Microsoft Access system.

## Features

- **Multi-user authentication** with JWT (access + refresh tokens)
- **Role-based access control** (Admin / Staff)
- **Full CRUD** for Customers, Suppliers, Products, Orders, Opportunities
- **Certification expiry tracking** with alerts for 30-day window
- **Compliance logging** (Allergen, Audit, Document, Feedback, etc.)
- **File uploads** for documents and certifications
- **Dashboard overview** with key metrics
- **Search, filter, and pagination** on all entities
- **Audit logging** for all create/update/delete operations
- **Soft deletes** for data safety
- **CSV import** script for data migration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Frontend | React (Vite), Tailwind CSS, React Router, React Query |
| File Storage | Local disk (abstracted for S3 swap) |
| Containerization | Docker + Docker Compose |

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Seed script
├── scripts/
│   └── csvImport.js       # CSV import utility
├── src/
│   ├── config/            # App config + database client
│   ├── middleware/         # Auth, validation, error handling, audit, upload
│   ├── modules/
│   │   ├── auth/          # Login, register, refresh token
│   │   ├── user/          # User management (admin)
│   │   ├── customer/      # Customer CRUD
│   │   ├── supplier/      # Supplier CRUD
│   │   ├── product/       # Product CRUD
│   │   ├── order/         # Order + OrderItems CRUD
│   │   ├── opportunity/   # Opportunity CRUD
│   │   ├── certification/ # Certification CRUD + expiry tracking
│   │   ├── complianceLog/ # Compliance log CRUD
│   │   ├── dashboard/     # Dashboard overview data
│   │   └── fileUpload/    # File upload/delete
│   ├── services/          # Abstracted services (file storage)
│   ├── utils/             # AppError, catchAsync, pagination, response helpers
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
├── uploads/               # File upload directory
├── .env                   # Environment variables
├── Dockerfile
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone and Install

```bash
git clone <repo-url>
cd backend
npm install
```

### 2. Configure Environment

Copy the example env file and update values:

```bash
cp .env.example .env
```

Edit `.env` with your database URL. The defaults work with the Docker Compose setup:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/business_mgmt?schema=public"
JWT_ACCESS_SECRET=your_strong_secret_here
JWT_REFRESH_SECRET=another_strong_secret_here
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 5. Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@business.com | Admin@123 |
| Staff | staff@business.com | Staff@123 |

## Docker Setup

```bash
# From the project root (where docker-compose.yml is)
docker-compose up -d

# Run migrations inside the container
docker-compose exec backend npx prisma migrate dev --name init

# Seed the database
docker-compose exec backend npm run db:seed
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/refresh-token` | Refresh access token | Public |
| GET | `/api/auth/profile` | Get current user | Required |
| POST | `/api/auth/change-password` | Change password | Required |
| POST | `/api/auth/register` | Register new user | Admin |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (paginated) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Deactivate user |

### Customers, Suppliers, Products, Orders, Opportunities, Certifications, Compliance Logs
All follow the same RESTful pattern:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{entity}` | List (paginated, filterable) |
| GET | `/api/{entity}/:id` | Get by ID |
| POST | `/api/{entity}` | Create |
| PUT | `/api/{entity}/:id` | Update |
| DELETE | `/api/{entity}/:id` | Soft delete |

### Special Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard overview |
| GET | `/api/certifications/expiring` | Expiring certifications |
| POST | `/api/files/upload` | Upload file |
| DELETE | `/api/files/:filename` | Delete file |
| GET | `/api/health` | Health check |

## CSV Import

Import data from CSV files:

```bash
node scripts/csvImport.js customers ./data/customers.csv
node scripts/csvImport.js suppliers ./data/suppliers.csv
node scripts/csvImport.js products ./data/products.csv
```

### CSV Format Examples

**customers.csv:**
```csv
name,email,phone,address,notes
"John Doe","john@example.com","+1234567890","123 Main St","VIP customer"
```

**suppliers.csv:**
```csv
name,email,phone,address
"Supplier Co","info@supplier.com","+1234567890","456 Trade St"
```

**products.csv:**
```csv
name,sku,description,supplierName,status
"Widget A","WDG-001","Premium widget","Supplier Co","ACTIVE"
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run csv:import` | Import CSV data |

## License

ISC
