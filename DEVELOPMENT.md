# Development Commands Cheat Sheet

## 🚨 FIRST: Check for Terminal Issues
```bash
node check-terminal.js    # Run this if commands fail
```

## Quick Start (Use these exact commands)

### Start Backend Server
```bash
node backend/simple-demo-server.js
```

### Start Frontend Development
```bash
npm run dev --prefix frontend
```

### Install Dependencies
```bash
npm install --prefix backend
npm install --prefix frontend
npm install --prefix contracts
```

### Run Tests
```bash
npm test --prefix backend
npm test --prefix frontend
npm test --prefix contracts
```

### Build Projects
```bash
npm run build --prefix frontend
npm run build --prefix backend
```

### TypeScript Compilation
```bash
npx tsc --prefix backend
npx tsx backend/demo-server.ts
```

## ⚠️ IMPORTANT: Terminal Navigation Issue

**NEVER use `cd` commands in VS Code integrated terminal tools. Always use relative paths from workspace root.**

### ❌ Don't Do This:
```bash
cd backend
node simple-demo-server.js    # Will fail - wrong directory

cd frontend
npm run dev                    # Will fail - wrong directory
```

### ✅ Always Do This:
```bash
# Use relative paths from workspace root
node backend/simple-demo-server.js
npm run dev --prefix frontend
```

## Common Workflows

### Full Development Setup
```bash
# Install all dependencies
npm install --prefix backend
npm install --prefix frontend
npm install --prefix contracts

# Start backend (in background)
node backend/simple-demo-server.js

# Start frontend (in new terminal)
npm run dev --prefix frontend
```

### Testing Authentication
```bash
# Ensure backend is running
node backend/simple-demo-server.js

# Frontend should be running on http://localhost:5173
# Backend API available at http://localhost:3005
```

### Contract Development
```bash
# Run Clarinet tests
clarinet test --prefix contracts

# Deploy to devnet
clarinet deploy --prefix contracts
```

## Port Reference
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3005 (Express API)
- **Database**: localhost:5432 (PostgreSQL, when configured)

## Troubleshooting

### Backend Won't Start
```bash
# Check if port is in use
netstat -ano | findstr :3005

# Kill process if needed
taskkill /PID <process_id> /F

# Start with full path if needed
node "C:\Users\PC\Desktop\pools\backend\simple-demo-server.js"
```

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules
npm install --prefix frontend

# Check TypeScript errors
npx tsc --noEmit --prefix frontend
```

---
**Remember**: Always work from the workspace root using relative paths!