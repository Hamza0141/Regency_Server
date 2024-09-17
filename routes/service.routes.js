// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the login controller
const serviceControllers = require("../controllers/service.controller");
// Create a route to handle the login request on post
router.post("/api/service", serviceControllers.createService);
router.get("/api/services", serviceControllers.getAllServices);
router.get("/api/service/:id", serviceControllers.getSingleService);
router.patch("/api/service/:id", serviceControllers.updateServiceById);
router.delete("/api/service/:id", serviceControllers.deleteServiceById);


// Export the router
module.exports = router;
