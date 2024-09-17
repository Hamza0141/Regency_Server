// Import the express module 
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the install router 
const installRouter = require('./install.routes');
// Import the employee routes 
const employeeRouter = require('./employee.routes');
// Import the employee routes 
const CustomerRouter = require('./customer.routes');
// Import the login routes 
const loginRoutes = require("./login.routes");
// Import the login routes 
const serviceRoutes = require("./service.routes");

const vehicleRoutes= require("./vehicle.routes")

const orderRoutes = require("./order.routes")

const OrderUpdate = require("./orderUpdate.routes")
// Add the install router to the main router 
router.use(installRouter);
// Add the employee routes to the main router 
router.use(employeeRouter);
// Add the login routes to the main router
router.use(loginRoutes);
// Add the service routes to the main router
router.use(serviceRoutes);

// Add the vehicle routes to the main router
router.use(vehicleRoutes);

router.use(CustomerRouter);

router.use(orderRoutes);

router.use(OrderUpdate);
// Export the router
module.exports = router; 