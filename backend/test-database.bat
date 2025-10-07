@echo off
echo 🧪 Testing PostgreSQL Database Integration
echo.

:: Set database variables
set DB_NAME=pools_db
set DB_USER=postgres

echo 📊 Testing database connection...
psql -U %DB_USER% -d %DB_NAME% -c "SELECT 'Database connection successful!' as status, NOW() as current_time;"

echo.
echo 👥 Testing users table...
psql -U %DB_USER% -d %DB_NAME% -c "SELECT COUNT(*) as total_users FROM users;"

echo.
echo 🏢 Testing groups table...
psql -U %DB_USER% -d %DB_NAME% -c "SELECT COUNT(*) as total_groups FROM groups;"

echo.
echo 🔗 Testing relationships...
psql -U %DB_USER% -d %DB_NAME% -c "SELECT COUNT(*) as total_memberships FROM group_members;"

echo.
echo 📋 Sample data preview...
psql -U %DB_USER% -d %DB_NAME% -c "SELECT u.display_name, g.title, g.status FROM users u JOIN group_members gm ON u.id = gm.user_id JOIN groups g ON gm.group_id = g.id LIMIT 5;"

echo.
echo ✅ Database integration test complete!
pause