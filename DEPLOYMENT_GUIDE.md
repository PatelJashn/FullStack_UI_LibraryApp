# Deployment Troubleshooting Guide

## Current Issues
- MongoDB connection not working in production
- Authentication (signin/login) not working
- UI components not loading

## Step-by-Step Fix

### 1. Backend (Render) Environment Variables

Make sure these environment variables are set in your Render backend service:

```
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
FRONTEND_URL=https://your-vercel-app-name.vercel.app
PORT=10000
```

**Important MongoDB Atlas Setup:**
1. Go to MongoDB Atlas dashboard
2. Click on "Network Access"
3. Add IP Address: `0.0.0.0/0` (allows all IPs)
4. Go to "Database Access"
5. Create a database user with read/write permissions
6. Get your connection string from "Connect" button

### 2. Frontend (Vercel) Environment Variables

In your Vercel project settings, add:

```
VITE_API_URL=https://your-backend-name.onrender.com
```

Replace `your-backend-name` with your actual Render backend service name.

### 3. Test MongoDB Connection

Run this command locally to test your MongoDB connection:

```bash
cd backend
node test-mongo.js
```

### 4. Verify Backend Health

Visit your backend health endpoint:
```
https://your-backend-name.onrender.com/health
```

You should see:
```json
{
  "status": "Server is running",
  "mongodb": "Connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 5. Check CORS Issues

If you see CORS errors in browser console, verify:
- Your frontend URL is in the CORS origins list
- The backend is accessible from your frontend domain

### 6. Authentication Flow

The app has fallback authentication that works without MongoDB:
- Users are stored in memory when MongoDB is not connected
- This allows basic functionality but data is lost on server restart

### 7. Common Issues & Solutions

**Issue: "MongoDB not connected" in health check**
- Solution: Check MONGO_URI environment variable in Render
- Verify MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- Check database user permissions

**Issue: CORS errors**
- Solution: Add your frontend domain to CORS origins
- Check if backend URL is correct in frontend environment

**Issue: Components not loading**
- Solution: Check if backend is responding to /api/ui-components
- Verify frontend is using correct API URL

**Issue: Login/Signup not working**
- Solution: Check JWT_SECRET environment variable
- Verify backend authentication routes are accessible

### 8. Testing Steps

1. Test backend health: `https://your-backend.onrender.com/health`
2. Test components API: `https://your-backend.onrender.com/api/ui-components`
3. Test authentication: Try to signup/login
4. Check browser console for errors
5. Check Render logs for backend errors

### 9. Environment Variables Checklist

**Backend (Render):**
- [ ] MONGO_URI (MongoDB Atlas connection string)
- [ ] JWT_SECRET (random secure string)
- [ ] FRONTEND_URL (your Vercel app URL)
- [ ] PORT (usually 10000 for Render)

**Frontend (Vercel):**
- [ ] VITE_API_URL (your Render backend URL)

### 10. Quick Fix Commands

If you need to update environment variables:

**Render:**
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add/update variables
5. Redeploy

**Vercel:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add/update variables
5. Redeploy

## Need Help?

If issues persist:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test MongoDB connection locally first
