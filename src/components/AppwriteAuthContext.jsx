import React, { createContext, useContext, useState, useEffect } from "react";
import { account, databases, DATABASE_ID, COLLECTIONS } from "../config/appwrite.js";

const AppwriteAuthContext = createContext();

export const AppwriteAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const session = await account.get();
      if (session) {
        // Get additional user data from our database
        const userData = await getUserData(session.$id);
        setUser(userData);
      }
    } catch (error) {
      console.log('No active session found');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async (userId) => {
    try {
      // Try to get user data from our custom users collection
      const userDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
      return {
        $id: userDoc.$id,
        email: userDoc.email,
        name: userDoc.name,
        username: userDoc.username,
        avatar: userDoc.avatar,
        createdAt: userDoc.$createdAt,
        preferences: userDoc.preferences || {}
      };
    } catch (error) {
      // If user doesn't exist in our collection, create them
      console.log('User not found in database, creating new user record');
      return await createUserRecord(userId);
    }
  };

  const createUserRecord = async (userId) => {
    try {
      // Get basic info from Appwrite account
      const accountData = await account.get();
      
      // Create user record in our database
      const userData = {
        $id: userId,
        email: accountData.email,
        name: accountData.name || accountData.email.split('@')[0],
        username: accountData.name || accountData.email.split('@')[0],
        avatar: '',
        preferences: {
          theme: 'light',
          notifications: true
        }
      };

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId, // Use the same ID as Appwrite account
        userData
      );

      return userData;
    } catch (error) {
      console.error('Error creating user record:', error);
      // Return basic user data even if database creation fails
      const accountData = await account.get();
      return {
        $id: accountData.$id,
        email: accountData.email,
        name: accountData.name || accountData.email.split('@')[0],
        username: accountData.name || accountData.email.split('@')[0],
        avatar: '',
        createdAt: accountData.$createdAt,
        preferences: {}
      };
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const session = await account.createEmailPasswordSession(email, password);
      
      if (session) {
        const userData = await getUserData(session.userId);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);

      // Create account
      const accountData = await account.create('unique()', email, password, name);
      
      // Create email session
      const session = await account.createEmailPasswordSession(email, password);
      
      if (session) {
        // Create user record in our database
        const userData = await createUserRecord(accountData.$id);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get Google OAuth URL
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        throw new Error('Google Client ID not configured');
      }

      // Create OAuth session
      const response = await account.createOAuth2Session(
        'google',
        `${window.location.origin}/auth/callback`,
        `${window.location.origin}/auth/error`
      );

      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
    }
  };

  const updateUser = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const updatedUser = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        user.$id,
        updates
      );

      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update user error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUser,
    checkUserSession,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AppwriteAuthContext.Provider value={value}>
      {children}
    </AppwriteAuthContext.Provider>
  );
};

export const useAppwriteAuth = () => {
  const context = useContext(AppwriteAuthContext);
  if (!context) {
    throw new Error('useAppwriteAuth must be used within an AppwriteAuthProvider');
  }
  return context;
};
