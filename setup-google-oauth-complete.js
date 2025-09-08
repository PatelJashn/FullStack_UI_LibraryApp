#!/usr/bin/env node

/**
 * Google OAuth Setup Completion Script
 * This script helps you complete the Google OAuth setup for your UI Library App
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Google OAuth Setup Completion Script');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, 'backend', '.env');
const envTemplatePath = path.join(__dirname, 'backend', 'env.template');

if (!fs.existsSync(envPath)) {
  console.log('❌ No .env file found in backend directory');
  console.log('📝 Creating .env file from template...\n');
  
  if (fs.existsSync(envTemplatePath)) {
    const template = fs.readFileSync(envTemplatePath, 'utf8');
    fs.writeFileSync(envPath, template);
    console.log('✅ .env file created from template');
  } else {
    // Create basic .env file
    const basicEnv = `# MongoDB Connection String
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority

# JWT Secret for session management
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth Credentials (REQUIRED for Google Auth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5002/api/auth/google/callback

# Server Port
PORT=5002

# Hugging Face API Key for AI-powered code modifications
HUGGINGFACE_API_KEY=your_huggingface_api_key_here`;
    
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Basic .env file created');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Google OAuth Setup Checklist:');
console.log('================================');

console.log('\n1. 🔧 Google Cloud Console Setup:');
console.log('   - Go to: https://console.cloud.google.com/');
console.log('   - Create a new project or select existing one');
console.log('   - Enable Google+ API or Google Identity API');
console.log('   - Configure OAuth consent screen');
console.log('   - Create OAuth 2.0 credentials');

console.log('\n2. 🔑 Required Credentials:');
console.log('   - Client ID');
console.log('   - Client Secret');
console.log('   - Authorized redirect URI: http://localhost:5002/api/auth/google/callback');

console.log('\n3. 📝 Environment Variables to Update:');
console.log('   Edit backend/.env file and replace:');
console.log('   - GOOGLE_CLIENT_ID=your_actual_client_id');
console.log('   - GOOGLE_CLIENT_SECRET=your_actual_client_secret');
console.log('   - JWT_SECRET=your_secure_random_string');
console.log('   - MONGO_URI=your_mongodb_connection_string');

console.log('\n4. 🧪 Test Configuration:');
console.log('   Run: npm run test:oauth');

console.log('\n5. 🚀 Start Development:');
console.log('   Backend: cd backend && npm run dev');
console.log('   Frontend: npm run dev');

console.log('\n📚 Documentation:');
console.log('   - Setup Guide: GOOGLE_OAUTH_SETUP.md');
console.log('   - Implementation Summary: GOOGLE_AUTH_SUMMARY.md');

console.log('\n🔍 Current Implementation Status:');
console.log('   ✅ Backend Google OAuth routes implemented');
console.log('   ✅ Frontend Google Sign-In component implemented');
console.log('   ✅ Login page with Google Auth integrated');
console.log('   ✅ Signup page with Google Auth integrated');
console.log('   ✅ Auth callback handling implemented');
console.log('   ✅ User model with Google ID support');
console.log('   ⚠️  Environment variables need configuration');

console.log('\n🎯 Next Steps:');
console.log('   1. Configure Google Cloud Console');
console.log('   2. Update .env file with your credentials');
console.log('   3. Test the OAuth flow');
console.log('   4. Deploy with production credentials');

console.log('\n✨ Google OAuth is ready to use once configured!');
