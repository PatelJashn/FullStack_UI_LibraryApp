#!/usr/bin/env node

/**
 * Google OAuth Configuration Test Script
 * 
 * This script helps verify that your Google OAuth setup is working correctly.
 * Run this script to test your configuration before using the app.
 */

// Using built-in fetch (Node.js 18+)

const API_BASE_URL = process.env.API_URL || 'http://localhost:5002';

async function testGoogleOAuthConfig() {
  console.log('🔍 Testing Google OAuth Configuration...\n');

  try {
    // Test 1: Check if Google OAuth is configured
    console.log('1. Checking Google OAuth status...');
    const statusResponse = await fetch(`${API_BASE_URL}/api/auth/google/status`);
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Google OAuth Status:', statusData.message);
    } else {
      console.log('❌ Google OAuth Status Check Failed:', statusResponse.status);
    }

    // Test 2: Check if the Google OAuth endpoint is accessible
    console.log('\n2. Testing Google OAuth endpoint accessibility...');
    const googleResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
      redirect: 'manual' // Don't follow redirects
    });
    
    if (googleResponse.status === 302) {
      const location = googleResponse.headers.get('location');
      if (location && location.includes('accounts.google.com')) {
        console.log('✅ Google OAuth endpoint is working');
        console.log('   Redirect URL:', location);
      } else {
        console.log('⚠️  Unexpected redirect location:', location);
      }
    } else if (googleResponse.status === 400) {
      const errorData = await googleResponse.json();
      console.log('❌ Google OAuth not configured:', errorData.message);
    } else {
      console.log('⚠️  Unexpected response:', googleResponse.status);
    }

    // Test 3: Check environment variables (if running locally)
    console.log('\n3. Environment Variables Check:');
    console.log('   API_BASE_URL:', API_BASE_URL);
    
    if (process.env.GOOGLE_CLIENT_ID) {
      console.log('   ✅ GOOGLE_CLIENT_ID: Set');
    } else {
      console.log('   ❌ GOOGLE_CLIENT_ID: Not set');
    }
    
    if (process.env.GOOGLE_CLIENT_SECRET) {
      console.log('   ✅ GOOGLE_CLIENT_SECRET: Set');
    } else {
      console.log('   ❌ GOOGLE_CLIENT_SECRET: Not set');
    }
    
    if (process.env.GOOGLE_CALLBACK_URL) {
      console.log('   ✅ GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
    } else {
      console.log('   ❌ GOOGLE_CALLBACK_URL: Not set');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n📋 Next Steps:');
  console.log('1. If all tests pass, your Google OAuth is configured correctly');
  console.log('2. If tests fail, check the GOOGLE_OAUTH_SETUP.md guide');
  console.log('3. Make sure your backend server is running');
  console.log('4. Verify your Google Cloud Console configuration');
}

// Run the test
testGoogleOAuthConfig().catch(console.error);
