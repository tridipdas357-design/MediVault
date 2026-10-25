# MediVault

Personal medical records manager: prescriptions, lab reports, vaccinations, consultation notes, medications, and appointments behind JWT auth.

## Stack

- Backend: Spring Boot 3, Spring Data JPA, MySQL, Spring Security + JWT
- Frontend: React (Vite), Axios, Tailwind CSS, lucide-react

## Local setup

To run locally without installing MySQL, use the embedded H2 database:

```bat
start-all.bat
```

Or start only the backend with `backend\run.bat`. Both launchers use the `local` Spring profile and store data in `backend/data/medivault`.
Only start one backend instance at a time: the local H2 database is file-based and cannot be opened by multiple backend processes simultaneously. If the backend is already running, use it at `http://localhost:8080`; stop it with Ctrl+C before restarting.

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

### Doctor QR access

The patient sets or changes a separate doctor access password from the **Doctor QR** page. The password is stored as a BCrypt hash. Scanning the QR opens a password prompt, and the read-only summary is returned only after the password is verified. Share the password separately from the QR code.

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/profile/share` | Yes | Get QR link and whether its password is set |
| POST | `/api/profile/share/password` | Yes | `{ password }` Set or change the doctor access password (8–72 characters) |
| POST | `/api/profile/share/refresh` | Yes | Rotate the QR link |
| POST | `/api/share/{token}/access` | No | `{ password }` → read-only patient summary |

## Deploy

### MySQL (Railway or another managed provider)

Create a MySQL instance and copy its connection details. If the database is hosted outside Render, enable public TCP access for the database and use the provider's public host and port. Keep its credentials private. JDBC URL shape:

```
jdbc:mysql://HOST:PORT/DATABASE?useSSL=true&serverTimezone=UTC
```

### Backend on Render (Docker)

1. In Render, create a **Blueprint** from this GitHub repository. Render reads `render.yaml` and configures the Docker service from the `backend` directory on the Free plan.
2. Enter the prompted `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and a strong `JWT_SECRET` (at least 32 characters) as private environment values. Do not commit these values.
3. Confirm `CORS_ORIGINS` matches the deployed Vercel frontend URL. The included Blueprint starts with `https://frontend-bice-nine-72.vercel.app`.
4. Render injects `PORT`; `application.yml` already reads it. The health check path is `/api/health`.

Note: the container filesystem is ephemeral. Uploaded medical scans will not be durable across redeploys unless you configure persistent storage or object storage. Do not store real patient data until you have reviewed the provider's privacy, security, and regulatory requirements and configured durable storage. `ddl-auto=update` creates tables on first boot.

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
