const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const orderRouter = require("./routes/orderRoute");
// const orderRouter = require("./routes/orderRoute.js");
const stripe = require('stripe')('sk_test_51Q0jkWP9YB5tzFF9p1I5y1Rckpap4IqrmY4nW1i9JBHLebHxonQAhhHp8gD2bu7gQS3vnd9iUkuiKfRnzyvHVskX00ABbOAZF7'); // Replace with your actual secret key



app.use(express.json());
app.use(cors());
// app.use("/order", orderRouter)
// Import necessary modules
// const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Get the MongoDB URI from the environment variables
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/images', express.static('upload/images'))

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage })


app.post('/upload', upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})


const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  available: {
    type: Boolean,
    default: true,
  }

})
//API TO ADD PRODUCTS
app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);
  await product.save();
  console.log("Saved");
});


app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name
  });
});
app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});



// Schema creation for for user model
const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

//Creating Endpoint for registering
app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "exists" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  })

  await user.save();

  const data = {
    user: {
      id: user.id
    }
  }

  const token = jwt.sign(data, 'secret_ecom');
  res.json({ success: true, token });
})

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port)
  }
  else {
    console.log("Error : " + error)
  }
})

//Creating endPoint for  user Login
app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token });
    }
    else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  }
  else {
    res.json({ success: false, errors: "Wrong EmailId" });
  }
})

// creating endpoint for newcollection data  
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newcollection);
})

//creating endPoint for popular in women section
// creating endpoint for popular in women section  
app.get('/popularinwomen', async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});


const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, 'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using valid token" })
    }
  }
};
// creating endpoint for adding products in cart  
app.post('/addtocart', fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});


// creating endpoint to remove product from cartdata  
app.post('/removeFromCart', fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed");
  }
});
// creating endpoint to get cartdata  
app.post('/getcart', fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});


// const paymentRoute = require('./routes/myRoute');
// // const orderRouter = require("./routes/orderRoute.js");

// app.use('/place', paymentRoute);

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

// app.use('/order', orderRouter);


// const Stripe = require("stripe");
// // Placing user order for frontend  
// const stripe = new Stripe("sk_test_51Q0jkWP9YB5tzFF9p1I5y1Rckpap4IqrmY4nW1i9JBHLebHxonQAhhHp8gD2bu7gQS3vnd9iUkuiKfRnzyvHVskX00ABbOAZF7")


// const orderSchema = mongoose.model('orderSchema', {
//   username: { type: String, required: true },
//   items: { type: Array, required: true },
//   amount: { type: Number, required: true },
//   address: { type: Object, required: true },
//   status: { type: String, default: "Clothing shipping" },
//   date: { type: Date, default: Date.now() },
//   payment: { type: Boolean, default: false }
// });
// app.post('/placeOrder', async (req, res) => {
//   const frontend_url = "http://localhost:3000"
//   try {
//     const newOrder = new orderSchema({
//       username: req.body.username,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address
//     })
//     await newOrder.save();
  

//     const data = {
//       user: {
//         id: newOrder.id
//       }
//     }
  
//     const token = jwt.sign(data, 'secret_ecom');
//     res.json({ success: true, token });
  
  
//     // await userModel.findByIdAndUpdate(req.body.userId, { orderSchema: {} });  
//     await Users.findByIdAndUpdate(req.body.id, { cartData: {} });


//     const line_items = req.body.items.map((item) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name
//         },
//         unit_amount: req.body.amount * 100 
//       },
//       quantity: item.quantity
//     }));

//     line_items.push({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: "Delivery Charges"
//         },
//         unit_amount: 0
//       },
//       quantity: 1
//     })

//     const session = await stripe.checkout.sessions.create({
//       line_items: line_items,
//       mode: 'payment',
//       success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//       // success_url: `${frontend_url}/verify?success=true`,
//       // cancel_url: `${frontend_url}/verify?success=false`,

//     })
//     window.location.href = 'https://buy.stripe.com/test_8wMaHJ8ZzgS20GkeUU';
//     console.log(session)
//     res.json({ success: true, session_url: session.url })
//   } catch (error) {
    
//     console.log("Error occured heyy")
//     console.log(error)

//     res.json({ success: false, message: "error" })


//   }
// }

// )


app.use(express.json());

const orderSchema = mongoose.model('orderSchema', {
  userID: { type: String,  required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Clothing shipping" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false }
});

app.post('/create-checkout-session', async (req, res) => {
  
  try {
    // const token = req.headers.authorization?.split(' ')[1]; // Get the token from Authorization header
    // if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // const decoded = jwt.verify(token, 'secret_ecom'); // Verify the token
    // const userId = decoded.id;
    const newOrder = new orderSchema({
      userID : req.body.userID,
      items: req.body.items,
      amount: req.body.amount,
    })
    // const token = jwt.sign(data, 'secret_ecom');
    
  
    
    const data = {
      user: {
        id: newOrder.id
      }
    }
    
    const token = jwt.sign(data, 'secret_ecom');
    console.log(newOrder)
    console.log(data)
    await newOrder.save();
    let line_items = []
    line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount:item.price * 100
      },
      quantity: item.quantity
    }));


  
    // await userModel.findByIdAndUpdate(req.body.userId, { orderSchema: {} });  
    // await Users.findByIdAndUpdate(req.body.userID, { cartData: {} });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Define payment methods
      line_items : line_items,
      mode: 'payment', // Can be 'payment', 'setup', or 'subscription'
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // Success redirect URL
      cancel_url: `${req.headers.origin}/cancel`, // Cancel redirect URL
    });
    res.json({ id: session.id }); // Send session ID to the frontend
    // orderSchema.findByIdAndUpdate(userID, { payment: true }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
    // orderSchema.findByIdAndDelete(userID);  
  }
});

// const verifyOrder = async (req,res) => {  
//   const { orderId, success } = req.body;  
//   try {  
//       if (success == "true") {  
//           await orderModel.findByIdAndUpdate(orderId, { payment: true });  
//           res.json({ success: true, message: "Paid" });  
//       } else {  
//           await orderModel.findByIdAndDelete(orderId);  
//           res.json({ success: false, message: "Not Paid" });  
//       }  
//   } catch (error) {  
//       console.log(error);  
//       res.json({ success: false, message: "Err" });  
//   }  
// }

