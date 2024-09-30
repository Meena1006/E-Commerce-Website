// src/pages/SuccessPage.jsx
import React, { useEffect, useState ,useContext} from 'react';
import { useSearchParams ,useNavigate} from 'react-router-dom';
import './CSS/SuccessPage.css';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const location = useLocation();
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  // Extract the session_id from the URL
  const params = new URLSearchParams(location.search);
  // const sessionId = params.get('session_id');

  
    const verifyPayment = async () => {
      try {
          await fetch('http://localhost:4000/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        });
        setVerified(true);
        navigate(`/myorder?session_id=${sessionId}`);

      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };
    
  
    
    

  
  return (
    <div className="success-container">
      <div className="success-card">
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>
        <p className="success-session">Session ID: {sessionId}</p>
        <a className="success-button" href='/' onClick={verifyPayment}>Go to Home</a>
      </div>
      
    </div>
  );
};

export default SuccessPage;

