import React from 'react';
import { Link } from 'react-router-dom';  
import symbol from '../../assets/Symbol.png';
import './navbar.css';

const Navbar = () => {
  return (
    <div className='bar'>
      <nav>
        <ul className="nav-left">
          <li className='image'>
            <a>
              <img src={symbol} alt="symbol" />
            </a>
          </li>
          <li className='tab'>
            <Link to="/homepage">Homepage</Link>
          </li>
          <li className='tab' id='cate'>
            <Link to="/categories">Categories</Link>  
          </li>
          <li className='tab'>
            <Link>About Us</Link>
          </li>
          <li className='tab'>
            <Link>Add Your Own UI</Link>
          </li>
        </ul>
        <ul className="nav-right">
          <li className='tab' id='signin'>
            <Link to="/signup" className="btn-light">Sign Up</Link>  
          </li>
          <li className='tab' id='login'>
            <Link to="/login" className="btn-dark">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
