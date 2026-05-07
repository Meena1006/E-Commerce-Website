import React from 'react'
import "./NewsLetter.css"
const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Get Exclusive Offers On Your Email</h1>
        <p>Subscribe to our newsletter amd stay updated</p>
        <div>
            <input type="email" placeholder='Youe Email ID' />
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter