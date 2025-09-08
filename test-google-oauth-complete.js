#!/usr/bin/env node

/**
 * Complete Google OAuth Test Script
 * Tests all aspects of Google OAuth implementation
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Google OAuth Complete Test Suite');
console.log('===================================\n');

// Test configuration
const BACKEND_URL = 'http://localhost:5002';
const FRONTEND_URL = 'http://localhost:5173';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(colors.green, `✅ ${message}`);
}

function logError(message) {
  log(colors.red, `❌ ${message}`);
}

function logWarning(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

function logInfo(message) {
  log(colors.blue, `ℹ️  ${message}`);
}

// Test 1: Check if backend server is running
async function testBackendServer() {
  logInfo('Testing backend server connection...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      logSuccess('Backend server is running');
      logInfo(`MongoDB Status: ${data.mongodb}`);
      return true;
    } else {
      logError('Backend server responded with error');
      return false;
    }
  } catch (error) {
    logError(`Backend server is not running: ${error.message}`);
    logWarning('Please start the backend server: cd backend && npm run dev');
    return false;
  }
}

// Test 2: Check Google OAuth configuration
async function testGoogleOAuthConfig() {
  logInfo('Testing Google OAuth configuration...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/google/status`);
    if (response.ok) {
      const data = await response.json();
      if (data.configured) {
        logSuccess('Google OAuth is properly configured');
        return true;
      } else {
        logError('Google OAuth is not configured');
        logWarning('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
        return false;
      }
    } else {
      logError('Failed to check Google OAuth status');
      return false;
    }
  } catch (error) {
    logError(`Error checking Google OAuth config: ${error.message}`);
    return false;
  }
}

// Test 3: Check environment variables
function testEnvironmentVariables() {
  logInfo('Checking environment variables...');
  const envPath = path.join(__dirname, 'backend', '.env');
  
  if (!fs.existsSync(envPath)) {
    logError('.env file not found in backend directory');
    logWarning('Please create .env file with required variables');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'JWT_SECRET',
    'MONGO_URI'
  ];
  
  let allConfigured = true;
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=your_`) || envContent.includes(`${varName}=`)) {
      logError(`${varName} is not properly configured`);
      allConfigured = false;
    } else {
      logSuccess(`${varName} is configured`);
    }
  });
  
  return allConfigured;
}

// Test 4: Check frontend integration
async function testFrontendIntegration() {
  logInfo('Testing frontend integration...');
  try {
    const response = await fetch(`${FRONTEND_URL}`);
    if (response.ok) {
      logSuccess('Frontend server is accessible');
      return true;
    } else {
      logError('Frontend server is not accessible');
      logWarning('Please start the frontend server: npm run dev');
      return false;
    }
  } catch (error) {
    logError(`Frontend server is not running: ${error.message}`);
    logWarning('Please start the frontend server: npm run dev');
    return false;
  }
}

// Test 5: Check Google OAuth endpoints
async function testGoogleOAuthEndpoints() {
  logInfo('Testing Google OAuth endpoints...');
  
  try {
    // Test Google OAuth initiation endpoint
    const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
      method: 'GET',
      redirect: 'manual'
    });
    
    if (response.status === 302 || response.status === 307) {
      const location = response.headers.get('location');
      if (location && location.includes('accounts.google.com')) {
        logSuccess('Google OAuth initiation endpoint is working');
        return true;
      } else {
        logError('Google OAuth redirect URL is incorrect');
        return false;
      }
    } else if (response.status === 400) {
      const data = await response.json();
      if (data.message === 'Google OAuth is not configured') {
        logError('Google OAuth is not configured');
        return false;
      }
    } else {
      logError(`Unexpected response from Google OAuth endpoint: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Error testing Google OAuth endpoints: ${error.message}`);
    return false;
  }
}

// Test 6: Check file structure
function testFileStructure() {
  logInfo('Checking file structure...');
  
  const requiredFiles = [
    'backend/routes/googleAuth.js',
    'src/components/GoogleSignIn.jsx',
    'src/pages/auth-callback/AuthCallback.jsx',
    'src/pages/loginpage/Login.jsx',
    'src/pages/signuppage/signup.jsx'
  ];
  
  let allFilesExist = true;
  requiredFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      logSuccess(`${filePath} exists`);
    } else {
      logError(`${filePath} is missing`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

// Main test function
async function runAllTests() {
  log(colors.bold, 'Starting Google OAuth Complete Test Suite...\n');
  
  const tests = [
    { name: 'File Structure', fn: testFileStructure },
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'Backend Server', fn: testBackendServer },
    { name: 'Google OAuth Configuration', fn: testGoogleOAuthConfig },
    { name: 'Google OAuth Endpoints', fn: testGoogleOAuthEndpoints },
    { name: 'Frontend Integration', fn: testFrontendIntegration }
  ];
  
  const results = [];
  
  for (const test of tests) {
    log(colors.bold, `\n🔍 Running: ${test.name}`);
    log('─'.repeat(50));
    
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      logError(`Test failed with error: ${error.message}`);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Summary
  log(colors.bold, '\n📊 Test Results Summary');
  log('═'.repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    if (result.passed) {
      logSuccess(`${result.name}: PASSED`);
    } else {
      logError(`${result.name}: FAILED`);
    }
  });
  
  log(colors.bold, `\n🎯 Overall Result: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    logSuccess('🎉 All tests passed! Google OAuth is fully configured and ready to use.');
  } else {
    logWarning('⚠️  Some tests failed. Please address the issues above.');
    logInfo('\n📚 For help, check:');
    logInfo('   - GOOGLE_OAUTH_SETUP.md for setup instructions');
    logInfo('   - GOOGLE_AUTH_SUMMARY.md for implementation details');
  }
  
  return passed === total;
}

// Run the tests
runAllTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  process.exit(1);
});
