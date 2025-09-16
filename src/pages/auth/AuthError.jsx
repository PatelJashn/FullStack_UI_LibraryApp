import { Link } from 'react-router-dom';

const AuthError = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #FAF9F6, #e9ecef)'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '90%'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          ❌
        </div>
        <h2 style={{
          color: '#dc2626',
          marginBottom: '16px'
        }}>
          Authentication Failed
        </h2>
        <p style={{
          color: '#6b7280',
          marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          There was an error during the authentication process. This could be due to:
        </p>
        <ul style={{
          textAlign: 'left',
          color: '#6b7280',
          marginBottom: '24px',
          paddingLeft: '20px'
        }}>
          <li>User cancelled the authentication</li>
          <li>Network connection issues</li>
          <li>Invalid OAuth configuration</li>
          <li>Account access denied</li>
        </ul>
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            to="/login"
            style={{
              padding: '12px 24px',
              background: '#1e40af',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              transition: 'background 0.3s'
            }}
          >
            Try Again
          </Link>
          <Link
            to="/"
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#1e40af',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              border: '2px solid #1e40af',
              transition: 'all 0.3s'
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
