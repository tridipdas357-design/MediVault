@echo off
REM MediVault Backend Launcher
cd /d "%~dp0"

echo ========================================================
echo Starting MediVault Backend...
echo ========================================================

REM Check if portable tools exist in parent .tools directory
if exist "%~dp0..\.tools\jdk-17\bin\java.exe" (
    set "JAVA_HOME=%~dp0..\.tools\jdk-17"
    set "PATH=%~dp0..\.tools\jdk-17\bin;%~dp0..\.tools\maven\bin;%PATH%"
)

REM Check if java is installed
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed or not in PATH!
    echo Please install OpenJDK 17 and restart this window.
    pause
    exit /b 1
)

REM Check if mvn is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven is not installed or not in PATH!
    echo Please install Apache Maven and restart this window.
    pause
    exit /b 1
)

REM Default: Embedded database (works out of the box with zero DB configuration)
set "DB_URL=jdbc:h2:file:./data/medivault;DB_CLOSE_DELAY=-1;MODE=MySQL"
set "DB_DRIVER=org.h2.Driver"
set "DB_USERNAME=sa"
set "DB_PASSWORD="
set "JWT_SECRET=medivault-super-secret-key-32chars-minimum"
set "CORS_ORIGINS=http://localhost:5173"

echo Database: Embedded H2 (./data/medivault)
echo API URL:  http://localhost:8080
echo.
mvn spring-boot:run
pause
