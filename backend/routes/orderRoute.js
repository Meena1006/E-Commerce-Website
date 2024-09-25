const express = require("express");
// const authMiddleware = require("../middleware/auth.js");
const { placeOrder } = require("../controllers/orderController.js");

const orderRouter = express.Router();

orderRouter.post("/place", placeOrder);

module.exports = orderRouter;
