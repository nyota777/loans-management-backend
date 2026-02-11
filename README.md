# Loans Management API (Admin Backend)

Admin-only REST API for a loans management system. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL (Supabase-compatible). All routes except login require JWT authentication.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase compatible)
- **ORM:** Prisma
- **Auth:** JWT (jsonwebtoken), bcrypt
- **Validation:** Zod
- **Other:** dotenv, cors, json2csv (CSV export)

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app and route mounting
│   ├── server.ts           # Server entry point
│   ├── config/env.ts       # Environment validation
│   ├── routes/             # Route definitions
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── middlewares/auth.middleware.ts
│   └── utils/
│       ├── prisma.ts       # Prisma client singleton
│       ├── loanCalculator.ts
│       └── csvExporter.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── package.json
└── README.md
```

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and set values:

```bash
cp .env.example .env
```

**Supabase connection:** Use the connection string from your Supabase project:

- Dashboard → Project Settings → Database → Connection string (URI).
- Use the **URI** and replace the placeholder password.

Example:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"
JWT_SECRET=your-super-secret-jwt-key-at-least-16-chars
```

### 3. Prisma migration

Generate the client and push the schema (or run migrations):

```bash
npm run db:generate
npm run db:push
```

For migration-based workflow:

```bash
npm run db:migrate
```

### 4. Seed the database

```bash
npm run db:seed
```

This creates:

- 1 admin: `admin@loans.com` / `Admin@123`
- 50 members (Member 1 … Member 50)
- Sample loans and payments (including penalties)

### 5. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:3001` (or the `PORT` in `.env`).

## API Overview

Base URL: `http://localhost:3001`

All endpoints except `POST /auth/login` require the header:

```
Authorization: Bearer <JWT>
```

### Authentication

| Method | Endpoint        | Description        |
|--------|-----------------|--------------------|
| POST   | `/auth/login`   | Login (email, password). Returns JWT and admin profile. |
| GET    | `/auth/me`      | Current admin profile (requires JWT). |

### Members

| Method | Endpoint       | Description                    |
|--------|----------------|--------------------------------|
| POST   | `/members`     | Create member                  |
| GET    | `/members`     | List members                   |
| GET    | `/members/:id` | Get member by ID               |
| PUT    | `/members/:id` | Update member                  |
| DELETE | `/members/:id` | Soft delete member            |

### Loans

| Method | Endpoint              | Description                    |
|--------|------------------------|--------------------------------|
| POST   | `/loans`              | Create loan (interest/duration auto-calculated) |
| GET    | `/loans`              | List loans (optional `?status=ACTIVE\|CLEARED\|DEFAULTED`) |
| GET    | `/loans/:id`          | Get loan by ID                 |
| GET    | `/loans/member/:memberId` | Loans for a member        |
| PUT    | `/loans/:id/status`   | Update loan status             |

### Payments

| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| POST   | `/payments`              | Record payment        |
| GET    | `/payments/loan/:loanId` | Payments for a loan   |
| GET    | `/payments/member/:memberId` | Payments for a member |

### Dashboard

| Method | Endpoint             | Description                          |
|--------|----------------------|--------------------------------------|
| GET    | `/dashboard/summary` | Summary: members, active/cleared/overdue loans, interest, penalties |

### Reports (JSON or CSV)

Append `?format=csv` for CSV download.

| Method | Endpoint                              | Description           |
|--------|---------------------------------------|-----------------------|
| GET    | `/reports/loans`                      | Loans report          |
| GET    | `/reports/payments`                   | Payments report       |
| GET    | `/reports/overdue`                    | Overdue loans         |
| GET    | `/reports/member/:memberId/loan-history` | Member loan history |

## Business Rules

- **Loans:** Fixed 12.5% per annum interest; max duration 48 months. Backend computes interest, total payable, and monthly installment.
- **Payments:** Reduce remaining balance; loan is marked CLEARED when balance reaches zero. Overpayments are rejected.
- **Late penalties:** Configurable via `LATE_PENALTY_PERCENT`; applied to late payments and added to remaining balance.

## Health check

- `GET /health` → `{ "status": "ok" }` (no auth required).

## Production

- Set `NODE_ENV=production`.
- Use a strong `JWT_SECRET` (≥ 16 characters).
- Run migrations with `npm run db:migrate` and start with `npm run start` (after `npm run build`).
