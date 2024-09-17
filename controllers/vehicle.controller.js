const vehicleService = require("../services/vehicle.service");

async function createVehicle(req, res, next) {
  // Check if vehicle already exists in the database
  const vehicleExists = await vehicleService.checkIfVehicleExists(req.body);
  if (vehicleExists) {
    res.status(400).json({
      return: "This vehicle  is already exist!",
    });
  } else {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      if (vehicle === true) {
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
}
const updateVehicleById = async (req, res, next) => {
  const id = req.params.id;

  const updateService = await vehicleService.updateVehicleById(id, req.body);

  if (!updateService) {
    res.status(400).json({
      error: "Failed to update vehicle!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

const getCustomerVehicle = async (req, res, next) => {
  const id = req.params.customer_id;
  const customerVehicle = await vehicleService.getCustomerVehicleByCustomerId(id);
  if (!customerVehicle) {
    res.status(400).json({
      error: "Failed to get the vehicle!",
    });
  } else {
    res.status(200).json(customerVehicle);
  }
};


const getCustomerVehicleByHash = async (req, res, next) => {
  const id = req.params.hash;
  const customerVehicle = await vehicleService.getCustomerVehicleByCustomerHash(
    id
  );
  if (!customerVehicle) {
    res.status(400).json({
      error: "Failed to get the vehicle!",
    });
  } else {
    res.status(200).json(customerVehicle);
  }
};

const getVehicleById = async (req, res, next) => {
  const id = req.params.vehicle_id;
  const customerVehicle = await vehicleService.getVehicleByVehicleId(
    id
  );
  if (!customerVehicle) {
    res.status(400).json({
      error: "Failed to get the vehicle!",
    });
  } else {
    res.status(200).json(customerVehicle);
  }
};




module.exports = {
  createVehicle,
  getVehicleById,
  updateVehicleById,
  getCustomerVehicle,
  getCustomerVehicleByHash,
};
