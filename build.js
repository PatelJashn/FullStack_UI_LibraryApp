#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  console.log('Starting custom build script...');
  
  // Set production API URL for the build
  process.env.VITE_API_URL = 'https://fullstack-ui-libraryapp.onrender.com';
  console.log('Set VITE_API_URL to:', process.env.VITE_API_URL);
  
  // Use npx to run vite build
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
