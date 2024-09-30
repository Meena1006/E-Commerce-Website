import React, { useContext, useRef } from 'react'
import "./Navbar.css"
import logo from "../Assets/logo.png"
import cart_logo from "../Assets/cart_icon.png"
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar = () => {
  const [menu, setmenu] = useState("shop")
  const {getTotalCartItems} = useContext(ShopContext)
  const menuRef = useRef();

  const dropdown_toggle = (e) =>{
       menuRef.current.classList.toggle('nav-menu-visible');
       e.terget.classList.toggle('open');
  }
  return (
    <div className='navbar'>
        <div className='nav-logo'>
          <img src={logo} alt="" />
        <h1>SHOP SPOT</h1>
        </div>
        <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
        <ul ref={menuRef} className='nav-menu'>

          <li onClick={()=>{setmenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link> {menu==="shop"?<hr/>: <></>}</li>
          <li onClick={()=>{setmenu("men")}}><Link style={{textDecoration:'none'}} to='/men'>Men</Link> {menu==="men"?<hr/>: <></>}</li>
          <li onClick={()=>{setmenu("women")}}><Link style={{textDecoration:'none'}} to='/women'>Women</Link>{menu==="women"?<hr/>: <></>}</li>
          <li onClick={()=>{setmenu("kids")}}><Link style={{textDecoration:'none'}} to='/kids'>Kids</Link> {menu==="kids"?<hr/>: <></>}</li>
          <li onClick={()=>{setmenu("myorder")}}><Link style={{textDecoration:'none'}} to='/myorder'>My-Orders</Link> {menu==="myorder"?<hr/>: <></>}</li>

        </ul>
        <div className='nav-login-cart'>
          {localStorage.getItem('auth-token')
          ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Log Out</button>
          :<Link to='/login'><button>Login</button></Link>
          }
          <Link to='/cart'><img src={cart_logo}alt="" /></Link>
          <div className="nav-cart-count">
            {getTotalCartItems()}
          </div>
        </div>
    </div>
  )
}

export default Navbar