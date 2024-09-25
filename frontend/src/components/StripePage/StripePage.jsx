import React, { useState, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { ShopContext } from '../../Context/ShopContext';

// const { getTotalCartAmount,all_product, cartItems, removeFromCart } = useContext(ShopContext);


// Load Stripe.js with your publishable key
const stripePromise = loadStripe('pk_test_51Q0jkWP9YB5tzFF9e2VMug37nwm5DOPi9StjVfPSQFvLjMCV7Q0HmDm5PKFw3xLqOeCIr8AMrtLHdluWWNLTm6f700nkZ8CmPZ');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
    } else {
      // Send paymentMethod.id to your server to create a PaymentIntent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount: 1000, currency: 'usd' }),
      });

      const { clientSecret } = await response.json();
      
      // Confirm payment
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret);
      
      if (confirmError) {
        setError(confirmError.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setError(null);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {error && <div>{error}</div>}
      {success && <div>Payment successful!</div>}
    </form>
  );
};

const StripeCheckout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripeCheckout;
