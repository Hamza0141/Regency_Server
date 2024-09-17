const orderUpdateService = require("../services/orderUpdate.service");

const orderInfoUpdater = async (req, res, next) => {
  const id = req.params.id;

  const updateOrder = await orderUpdateService.updateOrderInfo(id, req.body);
  if (!updateOrder) {
    res.status(400).json({
      error: "Failed to update orderInfo!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

const orderStatusUpdater = async (req, res, next) => {
  const id = req.params.id;

  const updateOrder = await orderUpdateService.updateOrderStatus(id, req.body);
  if (!updateOrder) {
    res.status(400).json({
      error: "Failed to update status!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

const orderService = async (req, res, next) => {
  const id = req.params.id;

  const updateOrder = await orderUpdateService.updateOrderServiceId(id, req.body);
  if (!updateOrder) {
    res.status(400).json({
      error: "Failed to update status!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};


const orderServiceStatus = async (req, res, next) => {
  const id = req.params.id;

  const updateOrder = await orderUpdateService.updateServiceStatuses(
    id,
    req.body
  );
  if (!updateOrder) {
    res.status(400).json({
      error: "Failed to update status!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

const orderNotesInternal = async (req, res, next) => {
  const id = req.params.id;

  const updateOrder = await orderUpdateService.updateNotesForInternal(
    id,
    req.body
  );
  if (!updateOrder) {
    res.status(400).json({
      error: "Failed to update note!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

const orderNoteForExternal = async (req, res, next) => {
  const id = req.params.id;

  const updateOrder = await orderUpdateService.updateNotesForCustomer(
    id,
    req.body
  );
  if (!updateOrder) {
    res.status(400).json({
      error: "Failed to update note!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

module.exports = {
  orderInfoUpdater,
  orderStatusUpdater,
  orderService,
  orderServiceStatus,
  orderNotesInternal,
  orderNoteForExternal,
};
