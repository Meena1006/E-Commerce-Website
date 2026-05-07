// src/pages/CancelPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/CancelPAge.css'; // Import the CSS file
import { useLocation } from 'react-router-dom';
const CancelPage = () => {
  const location = useLocation();

  // Extract the session_id from the URL
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (sessionId) {
      console.log("Payment was canceled for session:", sessionId);
      // Optionally, handle cancellation logic here
    }
  }, [sessionId]);


  const handleHomeRedirect = async() => {
    window.location.href = '/'; // Redirect to home page or any other page


  };

  return (
    <div className="cancel-container">
      <div className="cancel-content">
        <h1>Payment Canceled</h1>
        <p>We're sorry to hear that your payment was canceled.</p>
        <p>Kindly Please Try Again!</p>
        <button className="home-button" onClick={handleHomeRedirect}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default CancelPage;
