#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, 'backend', 'env.config');
const targetPath = path.join(__dirname, 'backend', '.env');

try {
  // Check if source file exists
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Source file env.config not found!');
    process.exit(1);
  }

  // Copy the file to .env
  fs.copyFileSync(sourcePath, targetPath);
  
  // Remove the temporary file
  fs.unlinkSync(sourcePath);
  
  console.log('✅ Successfully created .env file in backend directory!');
  console.log('✅ Google OAuth is now configured!');
  console.log('\nNext steps:');
  console.log('1. Restart your backend server');
  console.log('2. Test Google OAuth: npm run test:oauth');
  console.log('3. Try "Continue with Google" on signup/login page');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\nPlease manually rename backend/env.config to backend/.env');
}
