import React from 'react';
import './index.css';

const Navbar = () => {
  return (
    <div>
      <nav className='navbar'>
        <span>
          <b>Welcome</b>
        </span>
        <span>
          <span>
            <a href='http://localhost:3000/' className='navlink'>
              Home
            </a>
          </span>
          <span>
            <a href='https://www.tensorflow.org/js/models' className='navlink'>
              Models
            </a>
          </span>
          <span>
            <a href='https://www.tensorflow.org/js/models' className='navlink'>
              About
            </a>
          </span>
        </span>
      </nav>
    </div>
  );
};

export default Navbar;
