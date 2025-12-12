# VS Code Terminal Bug - 5 Sentence Summary

## The Problem in 5 Sentences:

1. **VS Code integrated terminal accessed through development tools has a directory navigation bug where `cd` commands appear to succeed but subsequent commands execute from the workspace root instead of the target directory.**

2. **This causes "Cannot find module" errors when trying to run scripts in subdirectories (like `backend/simple-demo-server.js`) because the terminal looks for files in the wrong location.**

3. **The bug is persistent and affects all directory changes made through the tools interface, making normal development workflows fail unexpectedly.**

4. **The solution is to always use relative paths from the workspace root (like `node backend/simple-demo-server.js`) instead of navigating to subdirectories first.**

5. **Manual terminals work correctly, but any automated terminal commands through VS Code tools must use absolute paths or relative paths from the project root to function properly.**

---

**TL;DR**: VS Code tools terminal doesn't maintain directory changes - always use `node backend/script.js` instead of `cd backend && node script.js`.