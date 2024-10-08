import React from 'react'
import { ShopContext } from '../../Context/ShopContext'
import "./CartItems.css"
import {useNavigate} from "react-router-dom"
import { useContext, useState} from 'react'
import remove_icon from "../Assets/cart_cross_icon.png"
import OrderSummary from '../OrderSummary/OrderSummary'

const CartItems = () => {
    const { getTotalCartAmount,all_product, cartItems, removeFromCart } = useContext(ShopContext);
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigate = useNavigate()

    const handleOpenDialog = () => {
        setDialogOpen(true);
    
    };

    const handleCloseDialog = () => {
        setDialogOpen(false)
    };
    return (
        <div className='cartitems'>
            <div className='cartitems-format-main'>
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />


            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return <div>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={e.image} alt="" className="carticon-product-icon" />
                            <p>{e.name}</p>
                            <p>${e.new_price}</p>
                            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                            <p>${e.new_price * cartItems[e.id]}</p>
                            <img src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                        </div>
                        <hr />
                    </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h2>CART SUMMARY</h2>
                    <OrderSummary/>
                    <h2>CART TOTALS</h2>
                    <div className="cartitems-total-item">
                        <p>Subtotal</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                <button  onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                <p>If you have a promo code, Enter it here</p>
                <div className="cartitems-promobox">
                    <input type="text" placeholder="promo code" />
                    <button>SUBMIT</button>
                </div>
            </div>
            </div>
            
        </div>
    );
}

export default CartItems