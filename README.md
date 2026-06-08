# Uncommon App

A MERN-style capstone app for tracking college applications. It uses React, Node/Express, PostgreSQL, and normal email/password authentication with JWT tokens.

## Setup

### 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

This starts Postgres on your computer at port `5433`, not `5432`, so it avoids the normal Mac/Postgres port conflict.

Database info:

```txt
Database: uncommon_dev
User: appuser
Password: apppassword
Host: localhost
Port: 5433
```

### 2. Backend env

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgres://appuser:apppassword@localhost:5433/uncommon_dev
JWT_SECRET=replace_this_with_any_long_random_string
```

You do **not** need Google OAuth env variables anymore.

### 3. Run backend

```bash
cd backend
npm install
npm run dev
```

You should see:

```txt
Database connected and synced
Server listening on http://localhost:5000
```

### 4. Run frontend

Open a second terminal from the project root:

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

## If Postgres says the password is wrong

That usually means Docker is reusing an old saved database volume with an old password. Reset it:

```bash
docker compose down
docker volume rm uncommon_pgdata
docker volume rm pgdata 2>/dev/null || true
docker compose up -d
```

Then restart the backend.

## If port 5000 is already in use

Find the process:

```bash
lsof -i :5000
```

Kill it:

```bash
kill -9 PID_HERE
```

Then run the backend again.

## Authentication routes

```txt
POST /api/users/signup
POST /api/users/login
GET  /api/users/me
```

The frontend stores the JWT in `localStorage` and sends it to `/api/users/me` when the page reloads.
