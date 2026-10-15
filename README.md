# MediVault

Personal medical records manager: prescriptions, lab reports, vaccinations, consultation notes, medications, and appointments behind JWT auth.

## Stack

- Backend: Spring Boot 3, Spring Data JPA, MySQL, Spring Security + JWT
- Frontend: React (Vite), Axios, Tailwind CSS, lucide-react

## Local setup

### 1. MySQL

Create a database (or let the JDBC URL create it):

```sql
CREATE DATABASE medivault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
```

Set environment variables (PowerShell example):

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/medivault?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-mysql-password"
$env:JWT_SECRET="change-me-to-a-long-random-secret-key"
$env:CORS_ORIGINS="http://localhost:5173"
```

Run:

```bash
mvn spring-boot:run
```

API: `http://localhost:8080`

Uploads land in `backend/uploads` and are also available under `/uploads/**` after authentication.

### 3. Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. `VITE_API_URL` must point at the backend (`http://localhost:8080` locally).

## API (Postman)

Base URL: `http://localhost:8080`

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| POST | `/api/auth/register` | No | `{ email, password, name }` |
| POST | `/api/auth/login` | No | `{ email, password }` → `{ token, user }` |
| GET | `/api/health` | No | `{ status: "UP" }` |
| GET/PUT | `/api/profile` | Bearer | Profile JSON |
| GET/POST | `/api/records` | Bearer | List / create |
| GET/PUT/DELETE | `/api/records/{id}` | Bearer | |
| POST | `/api/records/{id}/file` | Bearer | `multipart/form-data` field `file` |
| GET | `/api/records/{id}/file` | Bearer | Download attachment |
| GET/POST | `/api/medications` | Bearer | |
| GET/PUT/DELETE | `/api/medications/{id}` | Bearer | |
| GET/POST | `/api/appointments` | Bearer | |
| GET/PUT/DELETE | `/api/appointments/{id}` | Bearer | |

Set header `Authorization: Bearer <token>` after login. Errors are JSON:

```json
{
  "timestamp": "...",
  "status": 404,
  "error": "Not Found",
  "message": "Record not found",
  "path": "/api/records/1"
}
```

Typical statuses: `400` validation, `401` auth, `404` missing, `409` duplicate email, `500` unexpected (no stack traces in the body).

## Deploy

### MySQL (Railway or PlanetScale)

Create a MySQL instance and copy host, database, user, and password. JDBC URL shape:

```
jdbc:mysql://HOST:PORT/DATABASE?useSSL=true&serverTimezone=UTC
```

### Backend on Render (Docker)

1. Push this repo to GitHub.
2. New **Web Service** → Docker → root directory `backend` (Dockerfile is `backend/Dockerfile`).
3. Set environment variables from `backend/application-prod.yml.example`:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET` (32+ characters)
   - `CORS_ORIGINS` = your Vercel origin, e.g. `https://your-app.vercel.app`
   - `UPLOAD_DIR=/app/uploads` (optional)
4. Render injects `PORT`; `application.yml` already reads it.
5. Health check path: `/api/health`.

Note: the container filesystem is ephemeral. For durable scans, attach a disk or object storage later. `ddl-auto=update` creates tables on first boot.

### Frontend on Vercel

1. New project → `frontend` directory.
2. Framework: Vite.
3. Environment variable:
   - `VITE_API_URL=https://your-backend.onrender.com` (no trailing slash)
4. Redeploy after changing env vars.

`frontend/vercel.json` rewrites SPA routes to `index.html`.

## Project layout

```
backend/   Spring Boot API, Dockerfile, uploads/
frontend/  Vite React app
README.md
```
