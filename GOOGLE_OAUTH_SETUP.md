# Google OAuth Setup Guide

## Overview

This guide will help you set up Google OAuth authentication for your UI Library application. Google OAuth allows users to sign in with their Google accounts, providing a seamless authentication experience.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Your application running locally or deployed

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "UI Library App")
5. Click "Create"

### 2. Enable Google+ API

1. In your new project, go to the [APIs & Services](https://console.cloud.google.com/apis) page
2. Click "Enable APIs and Services"
3. Search for "Google+ API" or "Google Identity"
4. Click on "Google+ API" and click "Enable"

### 3. Configure OAuth Consent Screen

1. Go to [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
2. Select "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Your app name (e.g., "UI Library")
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. On the "Scopes" page, click "Save and Continue"
7. On the "Test users" page, add your email address as a test user
8. Click "Save and Continue"

### 4. Create OAuth 2.0 Credentials

1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Select "Web application" as the application type
4. Enter a name for your OAuth client (e.g., "UI Library Web Client")
5. Add authorized redirect URIs:

#### For Development:
```
http://localhost:5002/api/auth/google/callback
```

#### For Production (replace with your domain):
```
https://your-backend-domain.com/api/auth/google/callback
```

6. Click "Create"
7. **Important**: Copy the Client ID and Client Secret - you'll need these for your environment variables

### 5. Configure Environment Variables

#### Backend (.env file)
Add these variables to your backend `.env` file:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5002/api/auth/google/callback

# For production, use your actual domain:
# GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
```

#### Frontend (.env file)
Make sure your frontend has the correct API URL:

```bash
# Backend API URL
VITE_API_URL=http://localhost:5002

# For production:
# VITE_API_URL=https://your-backend-domain.com
```

### 6. Install Required Dependencies

Make sure your backend has the required packages:

```bash
npm install passport passport-google-oauth20
```

### 7. Test the Setup

1. Start your backend server
2. Start your frontend application
3. Go to the signup or login page
4. Click the "Continue with Google" button
5. You should be redirected to Google's OAuth consent screen
6. After authorizing, you should be redirected back to your app

## Troubleshooting

### Common Issues

#### 1. "Google OAuth is not configured"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in your backend `.env` file
- Restart your backend server after adding the environment variables

#### 2. "Redirect URI mismatch"
- Make sure the redirect URI in Google Cloud Console exactly matches your `GOOGLE_CALLBACK_URL`
- Check for trailing slashes or protocol mismatches (http vs https)

#### 3. "Invalid client" error
- Verify that your Client ID and Client Secret are correct
- Make sure you're using the right credentials for the correct environment (dev/prod)

#### 4. "Access blocked" error
- Add your email as a test user in the OAuth consent screen
- Make sure your app is not in "Testing" mode if you want public access

### Production Deployment

When deploying to production:

1. **Update Redirect URIs**: Add your production domain to the authorized redirect URIs in Google Cloud Console
2. **Update Environment Variables**: Change `GOOGLE_CALLBACK_URL` to your production URL
3. **Publish App**: If you want public access, publish your app in the OAuth consent screen
4. **HTTPS**: Ensure your production domain uses HTTPS (required for OAuth)

### Security Best Practices

1. **Keep Secrets Secure**: Never commit your Client Secret to version control
2. **Use Environment Variables**: Always use environment variables for sensitive data
3. **HTTPS in Production**: Always use HTTPS in production
4. **Regular Updates**: Keep your OAuth consent screen and app information up to date

## API Endpoints

Once configured, these endpoints will be available:

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles OAuth callback
- `GET /api/auth/google/status` - Checks if Google OAuth is configured

## Testing

You can test the OAuth flow using these curl commands:

```bash
# Check if Google OAuth is configured
curl http://localhost:5002/api/auth/google/status

# Initiate OAuth flow (will redirect to Google)
curl -L http://localhost:5002/api/auth/google
```

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Check your backend server logs
3. Verify all environment variables are set correctly
4. Ensure your Google Cloud Console configuration matches your setup
5. Test with the provided curl commands

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Google Cloud Console](https://console.cloud.google.com/)
