# 🚀 Supabase Setup Guide for Pools Project

## 📋 What You Need to Do Next

### **1. In Your Supabase Dashboard**

1. **Go to SQL Editor** (left sidebar)
2. **Copy and paste the schema setup:**
   - Open `db/supabase_schema.sql`
   - Copy all the content
   - Paste in Supabase SQL Editor
   - Click **"Run"**

3. **Copy and paste the sample data:**
   - Open `db/supabase_seed.sql`
   - Copy all the content
   - Paste in Supabase SQL Editor
   - Click **"Run"**

### **2. Get Your Connection Details**

1. **Go to Settings → Database** in your Supabase project
2. **Copy these values to your `.env` file:**

```env
# Replace these with your actual Supabase details:
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
```

### **3. Update Your Environment File**

Open `backend/.env` and replace the placeholder values:

```env
# Your actual Supabase details
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_actual_password

# Optional (get from Settings → API):
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### **4. Test the Connection**

```bash
cd backend
npm run build
npm start
```

You should see:
```
✅ Database connected successfully!
📅 Current time: [timestamp]
🗄️ PostgreSQL version: [version]
🚀 Server running on port 3002
```

### **5. Test the API Endpoints**

```bash
# Test with PowerShell
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

## 🎯 What This Sets Up

### **Database Tables:**
- **users** - Wallet-connected users
- **groups** - Investment pools
- **group_members** - Who joined which groups
- **group_tags** - Group categorization
- **transactions** - Contribution tracking

### **Demo Data:**
- **4 demo users** with realistic wallet addresses
- **4 investment groups** (different risk levels)
- **Group memberships** and relationships
- **Tags and transactions**

### **API Endpoints Ready:**
- `GET /api/users` - List all users
- `POST /api/users` - Create/connect user
- `GET /api/groups` - List all groups  
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/join` - Join group
- `DELETE /api/groups/:id/leave` - Leave group

## 🧪 Quick Test

Once setup is complete, test with:

```bash
# Health check
curl http://localhost:3002/api/health

# Get groups
curl http://localhost:3002/api/groups

# Get users  
curl http://localhost:3002/api/users
```

## 🎮 Demo Users You Can Use

```javascript
// These users are pre-loaded in your database:
const demoUsers = [
  "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7", // Alice The Investor
  "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60", // Bob The Trader  
  "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KTX9", // Carol The HODLer
  "SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A"  // Dave The Newbie
];
```

## 🛠️ Troubleshooting

### **"Database connection failed"**
1. Check your Supabase project is running
2. Verify connection details in `.env`
3. Make sure you're using the correct password

### **"No data in API responses"**
1. Ensure you ran both SQL scripts (schema + seed)
2. Check Supabase Table Editor to see if data exists

### **"Module not found" errors**
```bash
cd backend
npm install
npm run build
```

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Schema SQL script executed
- [ ] Seed data SQL script executed  
- [ ] Environment variables updated
- [ ] Backend server starts without errors
- [ ] Database connection successful message appears
- [ ] API endpoints return data

## 🎯 Next Steps After Setup

1. **Test frontend integration** - Connect React app to these APIs
2. **Create new groups** via your frontend
3. **Test user registration** flow
4. **Add smart contract integration**

Your backend now has real persistence with Supabase! 🎉