import React, { useEffect, useState } from 'react';
import "./CSS/MyOrders.css"
const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log("This is fetch")
                const response = await fetch('http://localhost:4000/getorders', {
                    method: 'POST',
                    headers: {
                        'auth-token': localStorage.getItem('auth-token'), // Token stored in localStorage
                        'Content-Type': 'application/json',
                    },
                    body:""
                });

                console.log("After fetch")
                const data = await response.json();
                setOrders(data);

            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        // <div>
        //     <h1>My Orders</h1>
        //     {orders.length > 0 ? (
        //         <ul>
        //             {orders.map((order,index) => (
        //                 <li key={index}>
        //                     <h3>Order {index+1}</h3>
        //                     <p><strong>name:</strong> {order.name}</p>
        //                     <p><strong>Items:</strong> {order.items.join(', ')}</p>
        //                     <p><strong>Total Amount:</strong> ${order.amount}</p>
        //                     <p><strong>Payment Status:</strong> {order.payment ? 'Paid' : 'Pending'}</p>
        //                 </li>
        //             ))}
        //         </ul>
        //     ) : (
        //         <p>You have no orders.</p>
        //     )}
        // </div>
        
        <div className="orders-container">
      {orders.length > 0 ? (
          <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Name</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{order.name}</td>
                <td> <ul className="item-list">
            {order.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                    <ul className='ul-class'><strong>{item.name}</strong> (x{item.quantity}) - ${item.price}</ul>
                </li>
            ))}
        </ul></td>
                <td>${order.amount}</td>
                <td>{order.status}</td>
                <td>
                                    {order.items.map((item, itemIndex) => (
                                        <li className='img-list'><img
                                            key={itemIndex}
                                            src={item.image}
                                            alt={item.name}
                                            className="order-image"
                                        /></li>
                                    ))}
                                </td>
              </tr>
            ))}
          </tbody>

        </table>
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
    );
};

export default MyOrders;

