# 🚨 ## 📋 ERROR CAPTURE - Copy-Paste Errors for Help

### VS Code Problems Panel Shows "No Problems" but Status Bar Shows Errors?
**📖 FULL SOLUTION GUIDE**: [Error Capture Guide](./docs/error-capture-guide.md)

### Quick Fixes:
1. `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. `Ctrl+Shift+P` → "Developer: Reload Window"  
3. `node capture-errors.js` (command line errors)

### Manual Error Check:
```bash
# Check TypeScript errors manually
cd frontend
npx tsc --noEmit
```ING QUICK REFERENCE 🚨

## ⚡ 5-Second Problem Summary
**VS Code tools terminal doesn't maintain directory changes - `cd` appears to work but commands run from workspace root. Solution: Always use `node backend/script.js` instead of `cd backend && node script.js`.**

## � ERROR CAPTURE - Copy-Paste Errors for Help

### Quick Error Capture:
```bash
node capture-errors.js    # Gets all errors in copy-paste format
```

### VS Code Problems Panel Not Showing?
1. Press `Ctrl+Shift+M` to open Problems panel
2. If still empty, try `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
3. Run `node capture-errors.js` to get command-line errors
4. Use VS Code Task: `Ctrl+Shift+P` → "Tasks: Run Task" → "🔍 Capture All Errors"

## �🔥 MOST COMMON ISSUES - Check These FIRST!

### 1. 🖥️ VS Code Terminal Issues
**Symptoms**: Commands fail, "file not found", backend won't start
**Solution**: [VS Code Terminal Issue Documentation](./docs/vscode-terminal-issue.md)
**Quick Fix**: Use relative paths from workspace root

### 2. 📋 Development Commands  
**Need**: How to start servers, install deps, run tests
**Reference**: [Development Commands Cheat Sheet](./DEVELOPMENT.md)

### 3. 🔧 Backend Server Issues
**Symptoms**: Port conflicts, authentication fails
**Quick Commands**:
```bash
netstat -ano | findstr :3005  # Check port usage
node backend/simple-demo-server.js  # Start server
```

### 4. 🎨 Frontend Build Issues
**Symptoms**: TypeScript errors, build failures
**Quick Commands**:
```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

---

## 📁 Documentation Index
- [VS Code Terminal Issue](./docs/vscode-terminal-issue.md) ⚠️ **READ FIRST**
- [Development Commands](./DEVELOPMENT.md) 📋 **DAILY USE**
- [Project README](./README.md) 📖 **OVERVIEW**
- [Architecture Docs](./docs/) 🏗️ **TECHNICAL**

---

**🎯 When in doubt, check the terminal issue doc first!**