import React from 'react';
import { Link } from 'react-router-dom';  
import symbol from '../../assets/Symbol.png';
import './navbar.css';

const Navbar = () => {
  return (
    <div className='bar'>
      <nav>
        <ul>
          <li className='image'>
            <a>
              <img src={symbol} alt="symbol" />
            </a>
          </li>
          <li className='tab' id='cate'>
            <Link to="/categories">Categories</Link>  
          </li>
          <li className='tab'>
            <a>Version 1.0</a>
          </li>
          <li className='tab'>
            <a>About Us</a>
          </li>
          <li className='tab'>
            <a>Add Your Own UI</a>
          </li>
          <li className='tab' id='signin'>
            <Link to="/signup">Signin</Link>  
          </li>
          <li className='tab' id='login'>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
