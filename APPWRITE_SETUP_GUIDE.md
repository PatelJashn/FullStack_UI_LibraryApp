# 🚀 Appwrite + Google OAuth Setup Guide

## ✅ What's Already Done

I've successfully integrated Appwrite with Google OAuth authentication into your UI Library app! Here's what's been implemented:

### 📦 **Installed & Configured:**
- ✅ Appwrite SDK installed
- ✅ Appwrite configuration file created (`src/config/appwrite.js`)
- ✅ New Appwrite authentication context (`src/components/AppwriteAuthContext.jsx`)
- ✅ Google OAuth login/signup buttons added to login and signup pages
- ✅ Auth callback and error pages created
- ✅ Updated App.jsx with new auth routes
- ✅ Updated Navbar to use Appwrite authentication
- ✅ Environment variables template updated

### 🔧 **Features Implemented:**
- ✅ Email/password authentication
- ✅ Google OAuth authentication
- ✅ User session management
- ✅ Automatic user profile creation
- ✅ Error handling and loading states
- ✅ Responsive UI with dark/light theme support

---

## 🛠️ **Setup Steps Required**

### 1. **Create Appwrite Project**

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Sign up/Login to your account
3. Create a new project
4. Copy your **Project ID** from the project settings

### 2. **Set up Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set **Application type** to "Web application"
6. Add these **Authorized redirect URIs**:
   - `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/[YOUR_PROJECT_ID]`
   - For development: `http://localhost:5173/auth/callback`
7. Copy your **Client ID**

### 3. **Configure Appwrite OAuth**

1. In your Appwrite project dashboard:
2. Go to **Auth** → **Settings**
3. Add Google OAuth provider:
   - **Provider**: Google
   - **App ID**: Your Google Client ID
   - **App Secret**: Your Google Client Secret
   - **Redirect URL**: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/[YOUR_PROJECT_ID]`

### 4. **Create Database & Collections**

In your Appwrite project:

#### Create Database:
1. Go to **Databases** → **Create Database**
2. Name: `ui_library_db`
3. Database ID: `ui_library_db`

#### Create Collections:

**Users Collection:**
1. Collection ID: `users`
2. **Attributes**:
   - `email` (String, 255, required)
   - `name` (String, 255, required)
   - `username` (String, 255, required)
   - `avatar` (String, 255)
   - `preferences` (String, 1000) - JSON string for user preferences

**UI Components Collection:**
1. Collection ID: `ui_components`
2. **Attributes**:
   - `title` (String, 255, required)
   - `description` (String, 1000)
   - `category` (String, 100)
   - `code` (String, 10000)
   - `author_id` (String, 255, required)
   - `tags` (String, 500)
   - `likes` (Integer, default: 0)
   - `downloads` (Integer, default: 0)

**Categories Collection:**
1. Collection ID: `categories`
2. **Attributes**:
   - `name` (String, 100, required)
   - `description` (String, 500)
   - `icon` (String, 255)

#### Set Collection Permissions:
For each collection, set these permissions:
- **Create**: `users` (authenticated users)
- **Read**: `any` (public read access)
- **Update**: `users` (authenticated users)
- **Delete**: `users` (authenticated users)

### 5. **Create Storage Buckets**

1. Go to **Storage** → **Create Bucket**
2. **Component Images Bucket**:
   - Bucket ID: `component_images`
   - Permissions: Public read, authenticated write
3. **User Avatars Bucket**:
   - Bucket ID: `user_avatars`
   - Permissions: Public read, authenticated write

### 6. **Environment Variables**

Create a `.env` file in your project root:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# Backend API URL (keep existing)
VITE_API_URL=http://localhost:5002
```

### 7. **Test the Setup**

1. Start your development server: `npm run dev`
2. Go to `/login` or `/signup`
3. Try both email/password and Google OAuth
4. Check if user data is created in your Appwrite database

---

## 🔧 **Troubleshooting**

### Common Issues:

1. **"Project ID not set" error**:
   - Make sure `VITE_APPWRITE_PROJECT_ID` is set in your `.env` file

2. **Google OAuth not working**:
   - Check if redirect URIs are correctly configured
   - Verify Google Client ID is correct
   - Ensure Appwrite OAuth settings match Google Console

3. **Database permission errors**:
   - Check collection permissions in Appwrite console
   - Make sure users collection allows create/read for authenticated users

4. **CORS issues**:
   - Appwrite Cloud handles CORS automatically
   - If using self-hosted Appwrite, configure CORS settings

---

## 🎯 **Next Steps**

After setup is complete, you can:

1. **Customize user profiles** - Add more fields to the users collection
2. **Implement file uploads** - Use Appwrite Storage for component images
3. **Add real-time features** - Use Appwrite Realtime for live updates
4. **Set up functions** - Use Appwrite Functions for server-side logic
5. **Add more OAuth providers** - GitHub, Discord, etc.

---

## 📚 **Useful Links**

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite OAuth Guide](https://appwrite.io/docs/authentication-oauth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Appwrite Cloud Console](https://cloud.appwrite.io)

---

**🎉 You're all set! Your app now has modern authentication with Appwrite and Google OAuth!**
