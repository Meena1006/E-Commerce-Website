import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'

const OrderSummary = () => {
    const {all_product, cartItems} = useContext(ShopContext);
    return (
        <div>{all_product.map((e) => {
            if (cartItems[e.id] > 0) {
                return <div>
                    <div className="cartitems-format cartitems-format-main">
                        <img src={e.image} alt="" className="carticon-product-icon" />
                        <p>{e.name}</p>
                        <span>{cartItems[e.id]}Qt</span>
                        <p>${e.new_price * cartItems[e.id]}</p>
                        
                    </div>
                    <hr />
                </div>
            }
            return null;
        })}</div>
    )
}

export default OrderSummary