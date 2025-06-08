@echo off
SETLOCAL

REM === Project root directory ===
cd /d C:\my-project

REM === Configurable ports ===
SET NEXT_PORT=3000
SET SANITY_PORT=3333

REM === Kill any process using ports 3000 (Next.js) and 3333 (Sanity) ===
echo Killing any process using ports %NEXT_PORT% and %SANITY_PORT%...
FOR /F "tokens=5" %%P IN ('netstat -aon ^| findstr :%NEXT_PORT%') DO taskkill /PID %%P /F >nul 2>&1
FOR /F "tokens=5" %%P IN ('netstat -aon ^| findstr :%SANITY_PORT%') DO taskkill /PID %%P /F >nul 2>&1

REM === Start Next.js dev server ===
echo Starting NEXT.js frontend on port %NEXT_PORT%...
start cmd /k "cd web && npm run dev"

REM === Start Sanity Studio dev server ===
echo Starting Sanity Studio on port %SANITY_PORT%...
start cmd /k "cd studio && npm run dev"

echo ✅ Servers are now running.
ENDLOCAL
