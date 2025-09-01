import React from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

const GoogleSignIn = ({ onSuccess, onError, disabled = false }) => {
  const { isDarkMode } = useTheme();

  const handleGoogleSignIn = () => {
    if (disabled) return;
    
    // Get the API base URL
    const apiBaseUrl = import.meta.env.PROD 
      ? 'https://fullstack-ui-libraryapp.onrender.com'
      : 'http://localhost:5002';
    
    // Redirect to Google OAuth
    window.location.href = `${apiBaseUrl}/api/auth/google`;
  };

  const styles = {
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: window.innerWidth <= 768 ? '12px' : '14px',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1a202c, #2d3748)' 
        : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#374151',
      border: isDarkMode 
        ? '1px solid rgba(255, 255, 255, 0.15)' 
        : '1px solid #e2e8f0',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: window.innerWidth <= 768 ? '14px' : '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: isDarkMode 
        ? '0px 2px 10px rgba(0, 0, 0, 0.2)' 
        : '0px 2px 10px rgba(0, 0, 0, 0.08)',
      opacity: disabled ? 0.6 : 1,
      position: 'relative',
      overflow: 'hidden',
      letterSpacing: '0.3px',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: isDarkMode 
        ? '0px 6px 20px rgba(0, 0, 0, 0.3)' 
        : '0px 6px 20px rgba(0, 0, 0, 0.12)',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.25)' : '#cbd5e0',
    },
    icon: {
      width: '22px',
      height: '22px',
      marginRight: '12px',
      filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
      transition: 'transform 0.3s ease',
    },
    text: {
      fontSize: 'inherit',
      fontWeight: 'inherit',
    },
    loadingSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: `2px solid ${isDarkMode ? '#ffffff' : '#374151'}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px',
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled}
        style={{
          ...styles.button,
          ...(disabled ? {} : { ':hover': styles.buttonHover })
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = isDarkMode 
              ? '0px 6px 20px rgba(0, 0, 0, 0.3)' 
              : '0px 6px 20px rgba(0, 0, 0, 0.12)';
            e.target.style.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : '#cbd5e0';
            // Animate the icon
            const icon = e.target.querySelector('svg');
            if (icon) {
              icon.style.transform = 'scale(1.1)';
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = isDarkMode 
              ? '0px 2px 10px rgba(0, 0, 0, 0.2)' 
              : '0px 2px 10px rgba(0, 0, 0, 0.08)';
            e.target.style.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#e2e8f0';
            // Reset the icon
            const icon = e.target.querySelector('svg');
            if (icon) {
              icon.style.transform = 'scale(1)';
            }
          }
        }}
      >
        {disabled ? (
          <div style={styles.loadingSpinner}></div>
        ) : (
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        <span style={styles.text}>
          {disabled ? 'Signing in...' : 'Continue with Google'}
        </span>
      </button>
    </>
  );
};

export default GoogleSignIn;

