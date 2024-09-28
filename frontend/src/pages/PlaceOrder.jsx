import React from 'react'
import './CSS/PlaceOrder.css'
import { Link } from "react-router-dom";

import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useContext , useState, useEffect} from 'react';
import { ShopContext } from '../Context/ShopContext';
// import { placeOrder } from '../../../backend/controllers/orderController.js';
// import { placeOrder } from '../../../backend/controllers/orderController';

// import {orderController} from './controllers/orderController';

const PlaceOrder = () => {
    const {getTotalCartAmount,all_product, cartItems} = useContext(ShopContext);
    const [data, setData] = useState({  
        firstName: "",  
        lastName: "",  
        email: "",  
        street: "",  
        city: "",  
        state: "",  
        zipcode: "", 
        country: "",  
        phone: ""  
    })
    
    const onChangeHandler = (event) => {  
        const name = event.target.name;  
        const value = event.target.value;  
        setData(data => ({...data, [name]: value}))  
    }  
    const placeOrder = async (event) => {

        // const token = localStorage.getItem('authToken'); // Example if stored in localStorage
        console.log("entering place Order")
        event.preventDefault();
        let orderItems = [];
        all_product.map((e) => {
          if (cartItems[e.id] > 0) {
            let itemInfo = e;
            itemInfo["quantity"] = cartItems[e.id];

            orderItems.push(itemInfo);
          }
        });
        console.log(orderItems);
        let orderData = {  
            username: data.firstName,
            items: orderItems,  
            amount: getTotalCartAmount() + 2,
            address: {
                street: data.street,
                city: data.city,
                state: data.state,
                zipcode: data.zipcode,
                country: data.country,
                phone: data.phone
            }  
          };  
          console.log("entering axios")
        //   let response = await axios.post("http://localhost:4000/order/place", orderData, {headers:{token}}); 
        // let response = await axios.post("http://localhost:4000/order/place", orderData, {headers:{token}}); 

        let responseData
    await fetch('http://localhost:4000/placeOrder',{
      method: 'POST',
      headers: {
        
        // 'Accept': 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    }).then(response => response.json()).then((data) => responseData = data);
        // let response = await axios.post("http://localhost:4000/placeOrder", orderData); 

          console.log(responseData.success)
          
          console.log("Response data")
          if (responseData) {  
            // const {session_url} = responseData.session_url;
            const {session_url} = responseData;
              
            console.log("hew")
            window.location.replace(session_url);  
            // const stripe = await stripePromise; // Make sure to load Stripe.js
            // const { error } = await stripe.redirectToCheckout({ sessionId });
            // if (error) {
            //     console.error('Error redirecting to Stripe Checkout:', error);
            //     alert('Error redirecting to Stripe Checkout');
            // }
          } else {  
            alert("Error hooray");  
          }
          
        };
        useEffect(() => {  
              console.log(data); 
            }, [data])
    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input   type="text" name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First name" />
                    <input   type="text" name="lastName" onChange={onChangeHandler} value={data.lastName}  placeholder="Last name" />
                </div>
                <input   type="email" name="email" onChange={onChangeHandler} value={data.email}  placeholder="Email address" />
                <input   type="text" name="street" onChange={onChangeHandler} value={data.street}  placeholder="Street" />
                <div className="multi-fields">
                    <input    type="text" name="city" onChange={onChangeHandler} value={data.city}  placeholder="City" />
                    <input   type="text" name="state" onChange={onChangeHandler} value={data.state}  placeholder="State" />
                </div>
                <div className="multi-fields">
                    <input   type="text" name="zipcode" onChange={onChangeHandler} value={data.zipcode} placeholder="Zip code" />
                    <input   type="text" name="country" onChange={onChangeHandler} value={data.country}  placeholder="Country" />
                </div>
                <input   type="text" name="phone" onChange={onChangeHandler} value={data.phone}  placeholder="Phone" />
            </div>
            <div className="place-order-right">
                <div className="cartitems-down">
                    <div className="cartitems-total">
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
                     <button type='submit'>PROCEED TO CHECKOUT</button>
                    </div>


                </div>
            </div>

        </form>
    )
}

export default PlaceOrder