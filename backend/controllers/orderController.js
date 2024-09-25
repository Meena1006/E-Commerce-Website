const orderModel = require("../models/orderModel.js");  
const Stripe = require("stripe");  

// Placing user order for frontend  
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)  

// placing user order for frontend  
const placeOrder = async (req,res) =>{  
    const frontend_url = "http://localhost:3000"
    try {  
        const newOrder = new orderModel({  
            userId: req.body.userId,  
            items: req.body.items,  
            amount: req.body.amount,  
            address: req.body.address
        }) 
        await newOrder.save();  
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });  

const line_items = req.body.items.map((item) => ({  
    price_data: {  
        currency: "inr",  
        product_data: {  
            name: item.name  
        }, 
        unit_amount:item.price*100*80 
    }, 
    quantity:item.quantity 
})); 
const session = await stripe.checkout.sessions.create({  
    line_items: line_items,  
    mode: 'payment',  
    success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,  

})
res.json({success:true, session_url:session.url})
    }  catch(error){

        console.log("Error occured")
res.json({success:false, message:"error"})


    }
}

module.exports = { placeOrder };
