const  orderService = require("../services/order.service")

async function createOrder(req, res, next) {
    try {

      const order = await orderService.addOrder(req.body);
      if (order === true) {
        return res.status(200).json({
          status: "true",
        });
      } else {
        return res.status(400).json({
          error: "Failed to add the Vehicle!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: "Something went wrong!",
      });
    }

}
const updateSingleOrder = async (req, res, next) => {
  const id = req.params.id;

  const updateOrder = await orderService.updateOrderByHash(
    id,
    req.body
  );
  if (!updateOrder) {
    res.status(400).json({
      error: "Failed to update order!",
    });
    
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

const getSingleOrder = async (req, res, next) => {
  const id = req.params.id;
  const singleOrder = await orderService.getOrderByHas(id);
  if (!singleOrder) {
    res.status(400).json({
      error: "Failed to get the Order!",
    });
  } else {
    res.status(200).json(singleOrder);
  }
};
const getAllOrders = async (req, res, next) => {
  const orders = await orderService.getAllOrders();
  if (!orders) {
    res.status(400).json({
      error: "Failed to get the Orders!",
    });
  } else {
    res.status(200).json(orders);
  }
};

const getOrderByCustomerId = async (req, res, next) => {
  const id = req.params.id;
  const singleOrder = await orderService.getOrdersByCustomerHash(id);
  if (!singleOrder) {
    res.status(400).json({
      error: "Failed to get the Order!",
    });
  } else {
    res.status(200).json(singleOrder);
  }
};
module.exports = {
  createOrder,
  updateSingleOrder,
  getSingleOrder,
  getAllOrders,
  getOrderByCustomerId,
};
