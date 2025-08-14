import React from 'react';
import { Link } from 'react-router-dom';  
import symbol from '../../assets/Symbol.png';
import './navbar.css';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    // Optionally redirect to homepage after logout
    window.location.href = '/';
  };

  return (
    <div className='bar'>
      <nav>
        <ul className="nav-left">
          <li className='image'>
            <Link to="/">
              <img src={symbol} alt="symbol" />
            </Link>
          </li>
          <li className='tab'>
            <Link to="/homepage">Homepage</Link>
          </li>
          <li className='tab' id='cate'>
            <Link to="/categories">Categories</Link>  
          </li>
          <li className='tab'>
            <Link to="/about">About Us</Link>
          </li>
          <li className='tab'>
            <Link to="/upload">Add Your Own UI</Link>
          </li>
        </ul>
        <ul className="nav-right">
          {!isAuthenticated ? (
            <>
              <li className='tab' id='signin'>
                <Link to="/signup" className="btn-light">Sign Up</Link>  
              </li>
              <li className='tab' id='login'>
                <Link to="/login" className="btn-dark">Login</Link>
              </li>
            </>
          ) : (
            <>
              <li className='tab' id='user' style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                color: '#fff',
                fontWeight: '500'
              }}>
                {user?.profilePic && (
                  <img 
                    src={user.profilePic} 
                    alt="profile" 
                    style={{
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      objectFit: 'cover', 
                      marginRight: 8,
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }} 
                  />
                )}
                <span style={{ fontSize: '14px' }}>
                  Welcome, {user?.fullName || user?.username || 'User'}
                </span>
              </li>
              <li className='tab' id='logout'>
                <button 
                  className="btn-dark" 
                  onClick={handleLogout} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.3)', 
                    color: 'aliceblue', 
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
