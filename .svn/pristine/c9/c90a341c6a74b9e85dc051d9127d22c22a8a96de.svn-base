@echo off
setlocal

cd /d %~dp0

echo ============================================
echo  TACS Milvus AI Environment START
echo ============================================
echo.

echo [1/4] Checking Docker...
docker info > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop is not running or permission denied.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is available.
echo.

echo [2/4] Starting Milvus containers...
echo Existing containers will be kept. Stopped containers will be started.
docker compose -f docker-compose-milvus.yml up -d
if errorlevel 1 (
    echo [ERROR] docker compose failed.
    echo Check docker-compose-milvus.yml file location.
    pause
    exit /b 1
)

echo.
echo [3/4] Waiting for containers...
timeout /t 3 /nobreak > nul

echo.
echo [4/4] Current Milvus containers:
echo --------------------------------------------
docker ps --filter "name=milvus-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo --------------------------------------------

echo.
echo ============================================
echo  Milvus : localhost:19530
echo  Attu   : http://localhost:8000
echo ============================================
echo.

pause
endlocal