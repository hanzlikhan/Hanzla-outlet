# Hanzla Outlet API

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `SECRET`.
2. **If your database password contains `@` or `#`**, URL-encode it in `DATABASE_URL`:
   - `@` → `%40`
   - `#` → `%23`  
   Example: password `Armin@11` → use `postgres:Armin%4011@host:5432/db`
3. From the **backend** folder run (PowerShell):
   ```powershell
   .\run.ps1
   ```
   Or run step by step:
   ```bash
   python scripts/check_db.py
   alembic upgrade head
   python -m app.seed
   ```
4. Start API: `uvicorn app.main:app --reload`

You can run scripts from **project root** too, e.g. `python backend/scripts/check_db.py` – the app will still find `.env` in the backend folder.

## Check DB connection

```bash
cd backend
python scripts/check_db.py
```

## Common errors

- **"No module named 'app'"** – Run from the `backend` folder, or use the full path (e.g. `python backend/scripts/check_db.py`). The scripts add the backend root to the path automatically.
- **"ConnectionRefusedError"** – PostgreSQL is not running or `DATABASE_URL` is wrong. For cloud DB (e.g. Supabase), URL-encode the password if it contains `@` or `#`.
- **"error parsing value for field CORS_ORIGINS"** – Fixed: `.env` now uses a plain string for `CORS_ORIGINS` (comma-separated).
