import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppwriteAuth } from '../../components/AppwriteAuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkUserSession } = useAppwriteAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if user session was created successfully
        await checkUserSession();
        
        // Redirect to home page
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth/error', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, checkUserSession]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      background: 'linear-gradient(135deg, #FAF9F6, #e9ecef)'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Completing authentication...</h2>
        <p>Please wait while we log you in.</p>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1e40af',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthCallback;
