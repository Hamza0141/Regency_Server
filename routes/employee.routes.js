// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee controller
const employeeController = require("../controllers/employee.controller");
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");
// Create a route to handle the add employee request on post
router.post(
    "/api/employee",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
    employeeController.createEmployee
);
// Create a route to handle the get all employees request on get
router.get(
    "/api/employees",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin], 
    employeeController.getAllEmployees );
    router.get(
      "/api/employee/:id",
      // [authMiddleware.verifyToken, authMiddleware.isAdmin],
      employeeController.getSingleEmployee
    );
    
router.patch(
  "/api/employee/:id",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.updateEmployee
);

router.delete(
  "/api/employee/:id",
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.deleteEmployeeById
);
router.patch(
  "/api/passwordreset",
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.resetEmployeePassword
);
router.patch(
  "/api/passwordchange",
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.changeEmployeePassword
);

    // Export the router
module.exports = router;