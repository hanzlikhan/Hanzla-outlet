# Run from backend folder. Requires .env with DATABASE_URL and SECRET.
# Usage: .\run.ps1   or   pwsh -File run.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "1. Checking DB connection..." -ForegroundColor Cyan
python scripts/check_db.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "Fix .env (DATABASE_URL, password with @ use %40) and ensure DB is running." -ForegroundColor Yellow
    exit 1
}

Write-Host "2. Running migrations..." -ForegroundColor Cyan
alembic upgrade head

Write-Host "3. Seeding data..." -ForegroundColor Cyan
python -m app.seed

Write-Host "Done. Start API with: uvicorn app.main:app --reload" -ForegroundColor Green
