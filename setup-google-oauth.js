#!/usr/bin/env node

/**
 * Google OAuth Setup Script
 * 
 * This script helps you set up Google OAuth for your UI Library application.
 * It will guide you through the process and create the necessary configuration.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGoogleOAuth() {
  console.log('🚀 Google OAuth Setup for UI Library\n');
  console.log('This script will help you configure Google OAuth authentication.\n');

  // Step 1: Check if .env file exists
  const envPath = path.join(__dirname, 'backend', '.env');
  const envExists = fs.existsSync(envPath);

  if (envExists) {
    console.log('✅ Found existing .env file');
    const backupPath = path.join(__dirname, 'backend', '.env.backup');
    fs.copyFileSync(envPath, backupPath);
    console.log('📋 Created backup at .env.backup');
  }

  // Step 2: Get Google OAuth credentials
  console.log('\n📋 Step 1: Google OAuth Credentials');
  console.log('Please follow these steps to get your Google OAuth credentials:\n');
  
  console.log('1. Go to: https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing one');
  console.log('3. Enable Google+ API:');
  console.log('   - Go to "APIs & Services" → "Library"');
  console.log('   - Search for "Google+ API" and enable it');
  console.log('4. Configure OAuth consent screen:');
  console.log('   - Go to "APIs & Services" → "OAuth consent screen"');
  console.log('   - Select "External" user type');
  console.log('   - Fill in app name and your email');
  console.log('   - Add your email as test user');
  console.log('5. Create OAuth credentials:');
  console.log('   - Go to "APIs & Services" → "Credentials"');
  console.log('   - Click "Create Credentials" → "OAuth 2.0 Client IDs"');
  console.log('   - Select "Web application"');
  console.log('   - Add redirect URI: http://localhost:5002/api/auth/google/callback');
  console.log('   - Copy the Client ID and Client Secret\n');

  const clientId = await question('Enter your Google Client ID: ');
  const clientSecret = await question('Enter your Google Client Secret: ');

  // Step 3: Get other required variables
  console.log('\n📋 Step 2: Other Configuration');
  
  const mongoUri = await question('Enter MongoDB URI (or press Enter for default): ') || 
    'mongodb+srv://uiforge:uiforge123@cluster0.mongodb.net/uiforge?retryWrites=true&w=majority';
  
  const jwtSecret = await question('Enter JWT Secret (or press Enter for default): ') || 
    'uiforge_jwt_secret_key_2024_secure_and_random';
  
  const huggingfaceKey = await question('Enter Hugging Face API Key (optional): ') || '';

  // Step 4: Create .env file
  const envContent = `# MongoDB Connection String
MONGO_URI=${mongoUri}

# JWT Secret for session management
JWT_SECRET=${jwtSecret}

# Google OAuth Credentials
GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}
GOOGLE_CALLBACK_URL=http://localhost:5002/api/auth/google/callback

# Server Port
PORT=5002

# Hugging Face API Key for AI-powered code modifications
HUGGINGFACE_API_KEY=${huggingfaceKey}

# Environment
NODE_ENV=development
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Successfully created .env file!');
    
    // Step 5: Test the configuration
    console.log('\n📋 Step 3: Testing Configuration');
    console.log('Testing Google OAuth configuration...\n');
    
    // Import and test the configuration
    const dotenv = await import('dotenv');
    dotenv.config({ path: envPath });
    
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      console.log('✅ Google OAuth credentials are configured');
      console.log('✅ JWT Secret is configured');
      console.log('✅ MongoDB URI is configured');
      
      console.log('\n🎉 Setup Complete!');
      console.log('\nNext steps:');
      console.log('1. Start your backend server: cd backend && npm start');
      console.log('2. Start your frontend: npm run dev');
      console.log('3. Test Google OAuth: npm run test:oauth');
      console.log('4. Go to signup/login page and try "Continue with Google"');
      
    } else {
      console.log('❌ Configuration incomplete. Please check your .env file.');
    }
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('\nPlease create the .env file manually with the following content:');
    console.log('\n' + envContent);
  }

  rl.close();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});

// Run the setup
setupGoogleOAuth().catch(console.error);
