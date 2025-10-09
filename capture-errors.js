#!/usr/bin/env node

/**
 * Error Capture Script  
 * Run this to capture and display all TypeScript/ESLint errors in copy-paste format
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Capturing Current Errors for Copy-Paste\n');

// Use the workspace root approach that we know works
const frontendPath = path.join(process.cwd(), 'frontend');

try {
  // Check if frontend directory exists
  if (!fs.existsSync(frontendPath)) {
    console.log('❌ Frontend directory not found. Are you in the workspace root?');
    console.log('� Run this command from: C:\\Users\\PC\\Desktop\\pools');
    process.exit(1);
  }

  console.log('� TYPESCRIPT ERRORS:');
  console.log('==========================================');

  try {
    // Change to frontend directory and run tsc
    process.chdir(frontendPath);
    const tscCheck = execSync('npx tsc --noEmit --pretty false', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ No TypeScript errors found in frontend');
  } catch (error) {
    console.log('❌ TypeScript Errors Found:');
    console.log('\n📋 COPY-PASTE FORMAT:');
    console.log('```');
    console.log(error.stdout || error.stderr);
    console.log('```\n');
  }

  // Reset to workspace root
  process.chdir(path.dirname(frontendPath));

} catch (error) {
  console.log('⚠️ Error running checks:', error.message);
  console.log('\n💡 Manual commands to try:');
  console.log('1. cd frontend');
  console.log('2. npx tsc --noEmit');
  console.log('3. npx eslint src --ext .ts,.tsx');
}

console.log('\n📝 CURRENT WORKSPACE:');
console.log(`Working Directory: ${process.cwd()}`);
console.log(`Frontend exists: ${fs.existsSync(frontendPath) ? '✅' : '❌'}`);

console.log('\n� HOW TO GET ERRORS:');
console.log('1. Open VS Code Problems panel (Ctrl+Shift+M)');
console.log('2. Look for red error count in status bar');
console.log('3. Click on any file with errors');
console.log('4. Copy error messages and paste when asking for help');