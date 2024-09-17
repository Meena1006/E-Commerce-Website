import React from 'react';  
import './Navbar.css';  
import navlogo from '../../assets/logo.png';  
import navProfile from '../../assets/nav-profile.svg';  

const Navbar = () => {  
  return (  
    <div className='navbar'>  
      <img src={navlogo} alt='' className='nav-logo' />  
      <span>SHOP SPOT ADMIN PANEL</span>
      {/* <img src={navProfile} className='nav-profile' alt='' />   */}
    </div>  
  );  
}
export default  Navbar;