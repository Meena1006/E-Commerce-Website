import React, { useState, useEffect }  from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route,useLocation } from 'react-router-dom';
import AddProduct from '../../Components/AddProducts/AddProducts';
import ListProduct from '../../Components/ListProduct/ListProduct';
import Admin_panel from "../../assets/admin.png"
import DefaultDisplay from '../../Components/DefaultDisplay/DefaultDisplay';

const Admin = () => {
    const [isImageVisible, setIsImageVisible] = useState(true);
    const location = useLocation();
    // Step 2: Handle button click to hide the image
    useEffect(() => {
        // Hide the image when the route changes
        if (location.pathname === '/addproduct' || location.pathname === '/listproduct') {
            setIsImageVisible(false);
        } else {
            setIsImageVisible(true);  // Show the image for any other route (e.g., default admin page)
        }
    }, [location.pathname]);
    return (
        <div className='admin'>
            <Sidebar />
            <div className="space">
                {isImageVisible && (
                    <DefaultDisplay/>
                )}
                <Routes>
                    <Route path='/addproduct'  element={<AddProduct />} />
                    <Route path='/listproduct'  element={<ListProduct />} />
                </Routes>
            
            </div>
        </div>
    );
};

export default Admin