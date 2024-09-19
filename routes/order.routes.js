// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the login controller
const orderControllers = require("../controllers/order.controller");
// Create a route to handle the login request on post
router.post("/api/order", orderControllers.createOrder);
// router.patch("/api/order/:id", orderControllers.updateSingleOrder);
router.get("/api/order/:id", orderControllers.getSingleOrder);
router.get("/api/order/", orderControllers.getAllOrders);
router.get("/api/cutomerorder/:id", orderControllers.getOrderByCustomerId);
module.exports = router
