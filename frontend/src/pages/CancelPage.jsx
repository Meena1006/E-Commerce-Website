// src/pages/CancelPage.js
import React from 'react';
import './CSS/CancelPAge.css'; // Import the CSS file

const CancelPage = () => {
  const handleHomeRedirect = () => {
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
