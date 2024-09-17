const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the customer controller
const customerController = require("../controllers/customer.controller");
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");
// Create a route to handle the add customer request on post
router.post(
  "/api/customer",
//   [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.createCustomer
);
router.get(
  "/api/customer",
  //   [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.getAllCustomer
);
router.get(
  "/api/customer/:id", 
  //   [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.getSingleCustomer
);
router.patch(
  "/api/customer/:id",
  //   [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.updateCustomerById
);


module.exports = router;
