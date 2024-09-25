import React from 'react'
import './CSS/PlaceOrder.css'
import { useContext , useState, useEffect} from 'react';
import { ShopContext } from '../Context/ShopContext';

const PlaceOrder = () => {
    const {getTotalCartAmount} = useContext(ShopContext);
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
    
    useEffect(() => {  
        console.log(data);  
    }, [data])
    return (
        <form className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input type="text" name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First name" />
                    <input type="text" name="lastName" onChange={onChangeHandler} value={data.lastName}  placeholder="Last name" />
                </div>
                <input type="email" name="email" onChange={onChangeHandler} value={data.email}  placeholder="Email address" />
                <input type="text" name="street" onChange={onChangeHandler} value={data.street}  placeholder="Street" />
                <div className="multi-fields">
                    <input  type="text" name="city" onChange={onChangeHandler} value={data.city}  placeholder="City" />
                    <input type="text" name="state" onChange={onChangeHandler} value={data.state}  placeholder="State" />
                </div>
                <div className="multi-fields">
                    <input type="text" name="zipcode" onChange={onChangeHandler} value={data.zipcode} placeholder="Zip code" />
                    <input type="text" name="country" onChange={onChangeHandler} value={data.country}  placeholder="Country" />
                </div>
                <input type="text" name="phone" onChange={onChangeHandler} value={data.phone}  placeholder="Phone" />
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
                        <button>PROCEED TO CHECKOUT</button>
                    </div>


                </div>
            </div>

        </form>
    )
}

export default PlaceOrder