import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { useTheme } from '../../components/ThemeContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const profilePic = searchParams.get('profilePic');
        const userId = searchParams.get('userId');
        const errorParam = searchParams.get('error');

        // Check for errors
        if (errorParam) {
          setError(errorParam);
          setStatus('error');
          return;
        }

        // Validate required parameters
        if (!token || !name || !email) {
          setError('Missing authentication parameters');
          setStatus('error');
          return;
        }

        // Create user object
        const userData = {
          _id: userId,
          fullName: decodeURIComponent(name),
          email: decodeURIComponent(email),
          profilePic: profilePic ? decodeURIComponent(profilePic) : '',
          isGoogleUser: true
        };

        // Login the user
        login(userData, token);
        
        setStatus('success');
        
        // Redirect to homepage after a short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);

      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed. Please try again.');
        setStatus('error');
      }
    };

    processAuthCallback();
  }, [searchParams, login, navigate]);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #0f0f0f, #1c1c1c)' 
        : 'linear-gradient(135deg, #FAF9F6, #e9ecef)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    card: {
      background: isDarkMode 
        ? 'rgba(255, 255, 255, 0.1)' 
        : '#FAF9F6',
      padding: '40px',
      borderRadius: '12px',
      backdropFilter: isDarkMode ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: isDarkMode ? 'blur(12px)' : 'none',
      boxShadow: isDarkMode 
        ? '0px 0px 15px rgba(255, 255, 255, 0.1)' 
        : '0px 4px 20px rgba(0, 0, 0, 0.08)',
      border: isDarkMode 
        ? '1px solid rgba(255, 255, 255, 0.2)' 
        : '2px solid #000000',
      textAlign: 'center',
      color: isDarkMode ? 'white' : '#2d3748',
      maxWidth: '400px',
      width: '100%',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: isDarkMode ? 'white' : '#2d3748',
    },
    message: {
      fontSize: '16px',
      marginBottom: '20px',
      color: isDarkMode ? '#ccc' : '#666',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid transparent',
      borderTop: `4px solid ${isDarkMode ? '#8a6eff' : '#1e40af'}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px',
    },
    successIcon: {
      width: '60px',
      height: '60px',
      color: '#10b981',
      margin: '0 auto 20px',
    },
    errorIcon: {
      width: '60px',
      height: '60px',
      color: '#ef4444',
      margin: '0 auto 20px',
    },
    button: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #6b47b6, #8a6eff)' 
        : '#1e40af',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: '0.3s',
      marginTop: '20px',
    },
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <>
            <div style={styles.spinner}></div>
            <h2 style={styles.title}>Processing Authentication</h2>
            <p style={styles.message}>Please wait while we complete your sign-in...</p>
          </>
        );
      
      case 'success':
        return (
          <>
            <div style={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h2 style={styles.title}>Authentication Successful!</h2>
            <p style={styles.message}>You have been successfully signed in. Redirecting...</p>
          </>
        );
      
      case 'error':
        return (
          <>
            <div style={styles.errorIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 style={styles.title}>Authentication Failed</h2>
            <p style={styles.message}>{error}</p>
            <button 
              style={styles.button}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {renderContent()}
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AuthCallback;

