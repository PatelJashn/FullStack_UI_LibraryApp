# Authentication System Guide

## Overview

This application now includes a complete authentication system with both traditional email/password login and Google OAuth integration. Users can create accounts, sign in, and manage their own UI components.

## Features

### 🔐 Authentication Methods
- **Email/Password Registration & Login**
- **Google OAuth Sign-In** (optional)
- **JWT Token-based Authentication**
- **Session Management**

### 👤 User Management
- **User Registration** with email and password
- **Profile Management** with user information
- **Component Ownership** - users can only edit/delete their own components
- **Google Profile Integration** - automatic profile picture and name from Google

### 🛡️ Security Features
- **Password Hashing** using bcrypt
- **JWT Token Authentication** with 7-day expiration
- **Authorization Middleware** for protected routes
- **User-specific Permissions** for component management

## Setup Instructions

### 1. Environment Variables

#### Frontend (.env)
```bash
# Backend API URL
VITE_API_URL=http://localhost:5002

# For production:
# VITE_API_URL=https://your-backend-name.onrender.com
```

#### Backend (.env)
```bash
# JWT Secret (required)
JWT_SECRET=your_super_secret_jwt_key_here

# MongoDB Connection (required)
MONGO_URI=your_mongodb_connection_string

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5002/api/auth/google/callback

# For production Google OAuth:
# GOOGLE_CALLBACK_URL=https://your-backend-name.onrender.com/api/auth/google/callback
```

### 2. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set up OAuth consent screen
6. Add authorized redirect URIs:
   - Development: `http://localhost:5002/api/auth/google/callback`
   - Production: `https://your-backend-name.onrender.com/api/auth/google/callback`
7. Copy the Client ID and Client Secret to your backend .env file

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Register a new user with email and password.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "fullName": "john_doe",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePic": ""
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "fullName": "john_doe",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePic": ""
  },
  "token": "jwt_token_here"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "fullName": "john_doe",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePic": ""
  }
}
```

### Google OAuth Routes

#### GET `/api/auth/google`
Initiate Google OAuth flow.

#### GET `/api/auth/google/callback`
Google OAuth callback (handled automatically).

#### GET `/api/auth/google/status`
Check if Google OAuth is configured.

### UI Components Routes (Protected)

All component management routes now require authentication:

#### POST `/api/ui-components`
Create a new component (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

#### PUT `/api/ui-components/:id`
Update a component (requires authentication + ownership).

#### DELETE `/api/ui-components/:id`
Delete a component (requires authentication + ownership).

#### POST `/api/ui-components/:id/like`
Like/unlike a component (requires authentication).

#### POST `/api/ui-components/:id/ai-modify`
Use AI to modify a component (requires authentication).

## Frontend Integration

### Authentication Context

The app uses React Context for authentication state management:

```javascript
import { useAuth } from './components/AuthContext';

const { user, token, login, logout, isAuthenticated } = useAuth();
```

### Protected Routes

Components that require authentication automatically check for valid tokens:

```javascript
// Example: Upload component
const { token, isAuthenticated } = useAuth();

if (!isAuthenticated) {
  // Redirect to login or show login prompt
}
```

### Google Sign-In Component

The `GoogleSignIn` component handles Google OAuth:

```javascript
import GoogleSignIn from './components/GoogleSignIn';

<GoogleSignIn disabled={loading} />
```

## User Permissions

### Component Ownership
- Users can only **edit** and **delete** components they created
- Users can **view** all public components
- Users can **like** any component
- Users can **use AI modification** on any component

### Authentication Required For:
- ✅ Creating new components
- ✅ Editing own components
- ✅ Deleting own components
- ✅ Liking components
- ✅ Using AI modification
- ❌ Viewing components (public)
- ❌ Copying component code (public)

## Database Schema

### User Model
```javascript
{
  fullName: String,
  username: String,
  email: String,
  password: String (hashed),
  profilePic: String,
  googleId: String (optional),
  timestamps: true
}
```

### UI Component Model
```javascript
{
  title: String,
  description: String,
  category: String,
  code: {
    html: String,
    css: String,
    js: String
  },
  author: ObjectId (ref: User),
  tags: [String],
  useTailwind: Boolean,
  likes: [ObjectId],
  downloads: Number,
  isPublic: Boolean,
  timestamps: true
}
```

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 10
- Minimum password length: 6 characters
- Google OAuth users get random passwords (not used for login)

### Token Security
- JWT tokens expire after 7 days
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Tokens include user ID, email, and username

### Authorization
- All protected routes verify JWT tokens
- Component ownership is verified before allowing edit/delete
- User IDs are compared as strings to handle both MongoDB ObjectIds and local IDs

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

#### 403 Forbidden
```json
{
  "message": "You can only edit your own components"
}
```

#### 404 Not Found
```json
{
  "message": "Component not found"
}
```

## Testing the Authentication

### 1. Test Registration
```bash
curl -X POST http://localhost:5002/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Protected Route
```bash
curl -X GET http://localhost:5002/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Common Issues

1. **"Google OAuth is not configured"**
   - Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in backend .env
   - Verify redirect URIs in Google Cloud Console

2. **"Invalid token"**
   - Token may have expired (7-day limit)
   - Check that `JWT_SECRET` is set correctly
   - Clear localStorage and login again

3. **"You can only edit your own components"**
   - Component was created by a different user
   - Check that you're logged in with the correct account

4. **MongoDB connection issues**
   - Verify `MONGO_URI` is correct
   - Check network connectivity
   - App will fall back to local storage if MongoDB is unavailable

## Production Deployment

### Environment Variables
- Set all required environment variables in your hosting platform
- Use strong, unique JWT secrets
- Configure Google OAuth for production domain

### Security Headers
- Enable HTTPS
- Set secure cookies for production
- Configure CORS properly

### Database
- Use MongoDB Atlas or similar for production
- Set up proper backup and monitoring
- Configure connection pooling

## Support

For issues or questions about the authentication system:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with the provided curl commands
4. Check the browser's Network tab for API request/response details
