@echo off
echo 🔧 Setting up PostgreSQL database for Pools project...
echo.

:: Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL first: https://www.postgresql.org/download/
    pause
    exit /b 1
)

echo ✅ PostgreSQL found
echo.

:: Set database variables (change these as needed)
set DB_NAME=pools_db
set DB_USER=postgres

echo 📊 Creating database '%DB_NAME%'...
createdb -U %DB_USER% %DB_NAME%
if %errorlevel% neq 0 (
    echo ⚠️  Database might already exist or creation failed
    echo Continuing with setup...
)
echo.

echo 🏗️  Running database migrations...
psql -U %DB_USER% -d %DB_NAME% -f "migrations\001_initial_schema.sql"
if %errorlevel% neq 0 (
    echo ❌ Migration failed
    pause
    exit /b 1
)
echo.

echo 🌱 Seeding sample data...
psql -U %DB_USER% -d %DB_NAME% -f "seeds\001_sample_data.sql"
if %errorlevel% neq 0 (
    echo ❌ Seeding failed
    pause
    exit /b 1
)
echo.

echo ✅ Database setup complete!
echo 🔗 Connection details:
echo    Database: %DB_NAME%
echo    User: %DB_USER%
echo    Host: localhost
echo    Port: 5432
echo.
echo 📝 Don't forget to update your .env file with these database credentials
echo.
pause