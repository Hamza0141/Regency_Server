// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the login controller
const orderUpdateControllers = require("../controllers/orderUpdate.controller");
// Create a route to handle the login request on post
router.patch("/api/orderinfo/:id", orderUpdateControllers.orderInfoUpdater);
router.patch("/api/orderstatus/:id", orderUpdateControllers.orderStatusUpdater);
router.patch("/api/orderservice/:id", orderUpdateControllers.orderService);
router.patch(
  "/api/servicestatus/:id",
  orderUpdateControllers.orderServiceStatus
)
router.patch(
  "/api/internalnote/:id",
  orderUpdateControllers.orderNotesInternal
);
router.patch(
  "/api/externalnote/:id",
  orderUpdateControllers.orderNoteForExternal
);
;
module.exports = router;
