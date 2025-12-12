#!/usr/bin/env node

/**
 * Terminal Issue Detector
 * Run this script to check if VS Code terminal navigation is working properly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VS Code Terminal Issue Detector\n');

// Check if we're in the correct directory
const currentDir = process.cwd();
const expectedFiles = ['backend', 'frontend', 'contracts', 'TROUBLESHOOTING.md'];

console.log(`Current directory: ${currentDir}`);

let issuesFound = 0;

// Check for expected project structure
expectedFiles.forEach(file => {
  const fullPath = path.join(currentDir, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ Found: ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    issuesFound++;
  }
});

// Check if we can access backend files
const backendServer = path.join(currentDir, 'backend', 'simple-demo-server.js');
if (fs.existsSync(backendServer)) {
  console.log(`✅ Backend server file accessible`);
} else {
  console.log(`❌ Backend server file NOT accessible`);
  issuesFound++;
}

console.log('\n📋 Results:');
if (issuesFound === 0) {
  console.log('🎉 No terminal navigation issues detected!');
  console.log('✅ You can proceed with normal development commands.');
} else {
  console.log('🚨 TERMINAL NAVIGATION ISSUE DETECTED!');
  console.log(`❌ ${issuesFound} issue(s) found.`);
  console.log('\n🔧 SOLUTION:');
  console.log('1. Read: docs/vscode-terminal-issue.md');
  console.log('2. Use: relative paths from workspace root');
  console.log('3. Example: node backend/simple-demo-server.js');
}

console.log('\n📚 Documentation:');
console.log('- TROUBLESHOOTING.md - Quick fixes');
console.log('- DEVELOPMENT.md - Command reference');
console.log('- docs/vscode-terminal-issue.md - Full analysis');