# Error Pattern Recognition Guide

## 🔍 How to Quickly Identify the VS Code Terminal Bug

### Pattern 1: File Not Found in Wrong Directory
```
Error: Cannot find module 'C:\Users\PC\Desktop\pools\simple-demo-server.js'
                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                    Missing: /backend/ in path
```
**Trigger**: If you see this pattern → Check [VS Code Terminal Issue](./docs/vscode-terminal-issue.md)

### Pattern 2: Command Success but Wrong Results
```bash
> cd backend
✅ (appears successful)
> node simple-demo-server.js  
❌ Error: Cannot find module...
```
**Trigger**: Success then immediate failure → Use relative paths

### Pattern 3: Port Already in Use (Secondary Issue)
```
Error: listen EADDRINUSE: address already in use :::3005
```
**This means**: Terminal issue was bypassed and server is already running!

## Quick Decision Tree

```
Command fails? 
├─ YES: Check error message
│   ├─ "Cannot find module" + missing subdirectory in path?
│   │   └─ 🚨 VS Code Terminal Bug → Use relative paths
│   ├─ "EADDRINUSE" (port in use)?
│   │   └─ ✅ Good! Server already running
│   └─ Other error?
│       └─ Check specific documentation
└─ NO: Command works
    └─ ✅ Continue development
```

## Memory Triggers for AI/Developers

**If you see ANY of these phrases in error messages:**
- "Cannot find module" + path missing subdirectory
- Commands work manually but fail through tools
- Backend server won't start despite file existing
- TypeScript build fails with path issues

**→ Immediately check [VS Code Terminal Issue Documentation](./docs/vscode-terminal-issue.md)**

## Quick Fix Commands (Copy-Paste Ready)

```bash
# ✅ These always work:
node backend/simple-demo-server.js
npm run dev --prefix frontend
npm install --prefix backend
npx tsx backend/demo-server.ts
```

---
**Remember**: Path issues = Terminal bug = Use relative paths from root!