const express = require("express");
const authMiddleware = require("../middleware/auth");
const { placeOrder } = require("../controllers/orderController");
// import { placeOrder } from "../controllers/orderController.js" 

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware, placeOrder);

module.exports = orderRouter;
