@echo off
setlocal

cd /d %~dp0

echo ============================================
echo  TACS Milvus AI Environment STOP
echo ============================================
echo.

echo [1/2] Checking Docker...
docker info > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop is not running or permission denied.
    pause
    exit /b 1
)

echo [2/2] Stopping Milvus containers...
docker compose -f docker-compose-milvus.yml down

echo.
echo Current Milvus containers:
echo --------------------------------------------
docker ps -a --filter "name=milvus-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo --------------------------------------------

echo.
pause
endlocal