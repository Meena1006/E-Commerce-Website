// src/pages/SuccessPage.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './CSS/SuccessPage.css';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="success-container">
      <div className="success-card">
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>
        <p className="success-session">Session ID: {sessionId}</p>
        <a href="/" className="success-button">Go to Homepage</a>
      </div>
    </div>
  );
};

export default SuccessPage;

