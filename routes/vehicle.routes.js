// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the login controller
const vehicleControllers = require("../controllers/vehicle.controller");
// Create a route to handle the login request on post
router.post("/api/vehicle", vehicleControllers.createVehicle);
router.patch("/api/vehicle/:id", vehicleControllers.updateVehicleById);
router.get("/api/vehicle/:customer_id", vehicleControllers.getCustomerVehicle);
router.get(
  "/api/vehiclehash/:hash",
  vehicleControllers.getCustomerVehicleByHash
);
router.get(
  "/api/vehicleid/:vehicle_id",
  vehicleControllers.getVehicleById
);

module.exports = router
