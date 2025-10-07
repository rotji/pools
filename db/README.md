# PostgreSQL Database Setup for Pools Project

## 📋 Prerequisites

1. **PostgreSQL installed** on your system
   - Download from: https://www.postgresql.org/download/
   - Make sure `psql` and `createdb` commands are available in your PATH

2. **Node.js dependencies installed**
   ```bash
   cd backend
   npm install
   ```

## 🚀 Quick Setup

### 1. Database Creation and Setup

Run the setup script from the `db` folder:

```bash
cd db/scripts
setup.bat
```

This will:
- Create the `pools_db` database
- Run the initial schema migration
- Seed with sample data for demo/testing

### 2. Environment Configuration

Copy the environment template and update with your PostgreSQL credentials:

```bash
cd backend
copy .env.example .env
```

Update your `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pools_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### 3. Start the Backend Server

```bash
cd backend
npm run build
npm start
```

Or for development with hot reload:
```bash
npm run dev
```

## 🧪 Testing

### Test Database Connection
```bash
cd backend
test-database.bat
```

### Test API Endpoints
```bash
# Start the server first
npm run dev

# In another terminal
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `wallet_address` (VARCHAR, Unique)
- `display_name` (VARCHAR)
- `bio` (TEXT)
- `avatar_url` (TEXT)
- `joined_groups` (INTEGER)
- `total_contributed` (DECIMAL)
- `reputation_score` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### Groups Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `contribution_amount` (DECIMAL)
- `currency` (VARCHAR)
- `current_members`, `max_members` (INTEGER)
- `type` (public/private)
- `status` (open/active/settled/closed)
- `risk_level` (low/medium/high)
- `created_by` (Foreign Key to Users)
- `created_at`, `updated_at` (TIMESTAMP)

### Group Members (Junction Table)
- `group_id` → Groups
- `user_id` → Users  
- `wallet_address` (VARCHAR)
- `joined_at` (TIMESTAMP)

### Group Tags
- `group_id` → Groups
- `tag_name` (VARCHAR)

## 🔧 Manual Database Management

### Connect to Database
```bash
psql -U postgres -d pools_db
```

### View Tables
```sql
\dt
```

### Sample Queries
```sql
-- Get all groups with member counts
SELECT g.title, g.current_members, g.max_members, g.status 
FROM groups g;

-- Get user's groups
SELECT u.display_name, g.title, gm.joined_at
FROM users u
JOIN group_members gm ON u.id = gm.user_id
JOIN groups g ON gm.group_id = g.id
WHERE u.wallet_address = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
```

### Reset Database
```bash
# Drop and recreate (WARNING: This deletes all data!)
dropdb -U postgres pools_db
cd db/scripts
setup.bat
```

## 🎯 API Endpoints

### Users
- `GET /api/users` - List all users
- `GET /api/users/:walletAddress` - Get user by wallet
- `POST /api/users` - Create/connect user
- `PUT /api/users/:walletAddress` - Update user profile
- `GET /api/users/:walletAddress/groups` - Get user's groups

### Groups  
- `GET /api/groups` - List all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/join` - Join a group
- `DELETE /api/groups/:id/leave` - Leave a group

### Health
- `GET /api/health` - API health check
- `GET /api/health/db` - Database health check

## 🎮 Demo Data

The setup includes demo users and groups for testing:

**Demo Users:**
- Alice The Investor (SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)
- Bob The Trader (SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60)  
- Carol The HODLer (SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KTX9)
- Dave The Newbie (SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A)

**Demo Groups:**
- STX Growth Pool #42 (Medium risk, 3 members)
- Conservative Crypto Fund (Low risk, 2 members)
- DeFi Yield Farming Pool (High risk, 0 members)
- Beginner Friendly Pool (Low risk, 0 members)

## 🛠️ Troubleshooting

### Common Issues

1. **"Database does not exist"**
   ```bash
   createdb -U postgres pools_db
   ```

2. **"Permission denied"**
   - Check PostgreSQL is running
   - Verify username/password in .env
   - Ensure user has database creation privileges

3. **"Port 5432 already in use"**
   - Another PostgreSQL instance might be running
   - Check with: `netstat -an | findstr :5432`

4. **"Connection refused"**
   - Start PostgreSQL service
   - Check if PostgreSQL is listening on localhost:5432

### Logs
```bash
# Check PostgreSQL logs (Windows)
# Usually in: C:\Program Files\PostgreSQL\[version]\data\log\

# Check application logs
# Server console output shows database connection status
```

## 🔄 Migration Strategy

For future schema changes:
1. Create new migration file: `db/migrations/002_your_change.sql`
2. Update the setup script to run new migrations
3. Document changes in this README

This setup provides a solid foundation for the pools investment platform prototype while keeping complexity minimal for demo purposes.