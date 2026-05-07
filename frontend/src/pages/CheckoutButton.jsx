import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Link } from "react-router-dom";

import axios from 'axios';
import "./CSS/CheckoutButton.css"
import { useContext , useState, useEffect} from 'react';
import { ShopContext } from '../Context/ShopContext';

const CheckoutButton = () => {
  const {getTotalCartAmount,all_product, cartItems} = useContext(ShopContext);
//--------------------------------------------------------
const [name, setname] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false); // New state to track button state

const handleInputChange = (event) => {
  setname(event.target.value);
};

const handleSubmit = (event) => {
  event.preventDefault();
  setIsSubmitting(true); // Disable the button on submit

  // Simulating a submission process (like an API call)
  setTimeout(() => {
    console.log("User ID submitted:", name);
    setIsSubmitting(false); // Re-enable the button after processing
    // setUserId(''); // Optionally clear the input field
  }, 2000); // Simulate a 2-second delay
};
  //-------------------------------------------------------
  const handleCheckout = async (event) => {
    event.preventDefault();
   console.log("Entering checkout handler")
   console.log(name)
        let orderItems = [];
        all_product.map((e) => {
          if (cartItems[e.id] > 0) {
            let itemInfo = e;
            itemInfo["name"] = e.name
            itemInfo["quantity"] = cartItems[e.id];
            itemInfo["price"] = e.new_price;

            orderItems.push(itemInfo);
          }
        });
        console.log(orderItems);
        let orderData = {  
            name: name,
            items: orderItems,  
            amount: getTotalCartAmount(),
          
          };  
          console.log("entering axios")
          // const token = localStorage.getItem('authToken');
    // Call your backend to create the Checkout Session
    const response = await fetch('http://localhost:4000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    console.log(response)
    const { id } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = await loadStripe('pk_test_51Q0jkWP9YB5tzFF9e2VMug37nwm5DOPi9StjVfPSQFvLjMCV7Q0HmDm5PKFw3xLqOeCIr8AMrtLHdluWWNLTm6f700nkZ8CmPZ'); // Replace with your public key
    await stripe.redirectToCheckout({ sessionId: id });

    
  };


  

  return (

    <div>
    <div className="container">
      <div className="form-container">
        <h1 className="form-title">Enter Your User ID</h1>
        <p className='ptag'>(Enter your correct user ID for proper processing)</p>
        <form onSubmit={handleSubmit}>
          <input 


            type="text" 
            value={name} 
            onChange={handleInputChange} 
            placeholder="User ID" 
            className="user-id-input" 
            required 
          />
          <button 
            type="submit" 
            className="submit-button" 
            disabled={isSubmitting} // Disable button based on state
          >
            {isSubmitting ? 'Submitting...' : 'Submit'} {/* Change button text */}
          </button>
        </form>
      </div>
    </div>
    <div class="center-container">
    
    <button class="centered-button" role="link" onClick={handleCheckout} >
      CONFIRM CHECKOUT
    </button>
  </div>

  </div>
  );
};

export default CheckoutButton;
