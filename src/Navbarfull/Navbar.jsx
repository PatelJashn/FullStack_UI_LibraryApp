import React from 'react';
import symbol from '../assets/Symbol.png';
import './Navbar.css'

const Navbar= () => {
    return(<div className='bar'>
                <nav>
                    <ul>
                        <li className='image'>
                            <a><img src={symbol} alt="symbol" /></a>
                        </li>
                        <li className='tab'>
                            <a>Categories</a>  
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
                    </ul>
                </nav>
            </div>
    )    
}

export default Navbar