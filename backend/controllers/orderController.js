const orderModel = require("../models/orderModel");  
const Stripe = require("stripe"); 
const userModel = require("../controllers/userController") 

// Placing user order for frontend  
const stripe = new Stripe("sk_test_51Q0jkWP9YB5tzFF9p1I5y1Rckpap4IqrmY4nW1i9JBHLebHxonQAhhHp8gD2bu7gQS3vnd9iUkuiKfRnzyvHVskX00ABbOAZF7")  

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
        // await userModel.findByIdAndUpdate(req.body.userId, { orderSchema: {} });  
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

line_items.push({
    price_data:{
        currency:"inr",
        product_data:{
            name:"Delivery Charges"
        },
        unit_amount: 0
    },
    quantity:1
})

const session = await stripe.checkout.sessions.create({  
    line_items: line_items,  
    mode: 'payment',  
    success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,  

})
console.log(session)
res.json({success:true, session_url:session.url})
    }  catch(error){

        console.log("Error occured heyy")
res.json({success:false, message:"error"})


    }
}

module.exports = { placeOrder };
// exports.placeOrder = (req, res) => {
//     // Function logic here
// };
