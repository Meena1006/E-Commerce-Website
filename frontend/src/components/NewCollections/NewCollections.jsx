import React, { useSyncExternalStore } from 'react'
import { useEffect, useState } from 'react'
import "./NewCollections.css"
import Item from '../Item/Item'
import new_collection from "../Assets/new_collections"

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://e-commerce-backend-05qa.onrender.com"
    : "http://localhost:4000";

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([])
  useEffect(() => {  
    fetch(`${API_URL}/newcollections`)  
    .then(response => response.json())  
    .then(data => setNew_collection(data));  
}, []);
  return (
    <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr/>
        <div className="collections">
{new_collection.map((item,i)=>{
    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price= {item.new_price} old_price={item.old_price}/>
})}
        </div>
    </div>
  )
}

export default NewCollections