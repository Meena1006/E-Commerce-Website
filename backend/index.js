const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const stripe = require('stripe')('sk_test_51Q0jkWP9YB5tzFF9p1I5y1Rckpap4IqrmY4nW1i9JBHLebHxonQAhhHp8gD2bu7gQS3vnd9iUkuiKfRnzyvHVskX00ABbOAZF7'); // Replace with your actual secret key



app.use(express.json());
app.use(cors());
// app.use("/order", orderRouter)
// Import necessary modules
// const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { type } = require("os");

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
      id: user.id,
      name: user.name
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
          id: user.id,
          name: req.body.username,
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

//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------



app.use(express.json());

const orderSchema = mongoose.model('orderSchema', {
  userid:{type: String},
  name: { type: String,  required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Ordered" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false}
});

app.post('/create-checkout-session', async (req, res) => {
  
  try {
    // const token = req.headers.authorization?.split(' ')[1]; // Get the token from Authorization header
    // if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // const decoded = jwt.verify(token, 'secret_ecom'); // Verify the token
    // const userId = decoded.id;
    const user = await Users.findOne({ name: req.body.name });
    const newOrder = new orderSchema({
      userid: user._id,
      name : req.body.name,
      items: req.body.items,
      amount: req.body.amount,
    })
    // const token = jwt.sign(data, 'secret_ecom');
    
  

    const data = {
      user: {
        id: newOrder.id,
        // id: user._id,
        name:  req.body.name,

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
    // await users.findByIdAndUpdate(req.body.userID, { cartData: {} });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Define payment methods
      line_items : line_items,
      mode: 'payment', // Can be 'payment', 'setup', or 'subscription'
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // Success redirect URL
      cancel_url: `${req.headers.origin}/cancel`, // Cancel redirect URL
      metadata: {
        order_id: newOrder.id, // The ID of the order you created in your database
        name: req.body.name, // Optional: Store the user's ID for reference
      },
    });
    res.json({ id: session.id , token}); // Send session ID to the frontend
    // orderSchema.findByIdAndUpdate(userID, { payment: true }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
    // orderSchema.findByIdAndDelete(userID);  
  }
});

app.post('/verify', async (req, res) => {
  const { session_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

        // Extract the orderer's name from the session metadata
        const ordererName = session.metadata.name;

        // Find the user by their name
        const user = await Users.findOne({ name: ordererName });

        if (user) {
            // Clear cartData if user is found
            const clearedCartData = {};
            for (let index = 0; index < 300 + 1; index++) {
                clearedCartData[index] = 0; // Set all values to 0
            }
        
            // Update the user's cartData to the clearedCartData object
            await Users.findByIdAndUpdate(user, { cartData: clearedCartData });
        }
    
        // session.metadata.order_id
      await orderSchema.findByIdAndUpdate(session.metadata.order_id, { payment: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
  }
});

// Node.js / Express Backend (for example)
app.post('/getorders', fetchUser, async (req, res) => {
  const id = req.user.id;
  

  try {
    // Find orders where name matches and paymentStatus is true
    const orders = await orderSchema.find({userid:id, payment: true });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

app.post('/getordersAdmin', async (req, res) => {

  try {
    // Find orders where name matches and paymentStatus is true
    const orders = await orderSchema.find({payment: true });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

app.put('/orders/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await orderSchema.findByIdAndUpdate(orderId, { status: status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});