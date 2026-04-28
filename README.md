# Full-Stack Expense Tracker

A production-focused expense tracker with a React frontend and Express backend, using MySQL for persistence and idempotency keys to safely handle retries.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL
- Deployment: Vercel (frontend, optional backend API) + managed MySQL provider

## Features

- Add expenses with `amount`, `category`, `description`, and `date`
- Expense list with filtering (`category`) and sorting (`date_desc`, `date_asc`)
- Total visible spend in INR format
- Category-wise spend summary
- Loading, error, and empty states in UI
- Idempotent `POST /expenses` using `idempotency_key`

## API

### `POST /expenses`

Creates a new expense.

Request body:

```json
{
  "amount": 99.5,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-04-28",
  "idempotency_key": "0e7d0f8f-4d08-4266-82f8-4987f48d18f8"
}
```

Notes:

- `amount` is accepted in rupees, stored as paise (`INT`) in DB.
- Sending the same `idempotency_key` returns the already created record with HTTP `200`.

### `GET /expenses`

Query params:

- `category=Food`
- `sort=date_desc|date_asc|amount_desc|amount_asc`

Returns an array of expenses with amount in rupees.

## Design Decisions

1. MySQL is used for reliable relational storage and easy managed hosting.
2. Monetary values are stored as integer paise to avoid floating-point precision bugs.
3. Idempotency keys are unique in DB, preventing duplicate rows on retries/double-submit.

## Trade-offs (time-boxed)

- No authentication/user accounts
- No pagination
- No edit/delete endpoints yet
- Minimal styling and no UI library

## Local Setup

## 1) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set values in `backend/.env`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=expense_tracker
PORT=3000
```

You can use `MYSQL_URL` instead of individual DB variables.

## 2) Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Then run:

```bash
npm run dev
```

## Deployment (Vercel + MySQL)

## Frontend on Vercel

1. Import the repo in Vercel
2. Set project root to `frontend`
3. Add `VITE_API_URL=https://<your-backend-url>`
4. Deploy

## Backend options

- Recommended: Deploy backend on a Node host (Render/Railway/Fly) and connect to managed MySQL
- Optional in this repo: `backend/vercel.json` and `backend/api/index.js` support Vercel serverless deployment

For backend env vars:

- `MYSQL_URL` or `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`

## Submission Checklist

- Public GitHub repo
- Live frontend URL
- Working backend URL
- Complete README with decisions/trade-offs
- Commit history screenshot
