#!/usr/bin/env node

// Production build script
// This ensures environment variables are properly set during build

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting production build...');

// Set the production API URL if not already set
if (!process.env.VITE_API_URL) {
  process.env.VITE_API_URL = 'https://fullstack-ui-libraryapp.onrender.com';
  console.log('📝 Set VITE_API_URL to:', process.env.VITE_API_URL);
}

// Run the build
try {
  console.log('🔨 Running Vite build...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env }
  });
  
  console.log('✅ Production build completed successfully!');
  console.log('🌐 API URL used:', process.env.VITE_API_URL);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
