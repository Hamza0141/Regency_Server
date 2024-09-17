const addrService = require("../services/service.service");

async function createService(req, res, next) {
  // Check if email already exists in the database
  const serviceExists = await addrService.checkIfServiceExists(
    req.body.service_name
  );
  if (serviceExists) {
    res.status(400).json({
      return : "This service  is already exist!",
    });
  } else {
    try {
      const serviceData = req.body;
      console.log(serviceData);
      // Create the employee
      const service = await addrService.createService(serviceData);
      console.log( service);
      if (service !== null) {
        return res.status(200).json({
          status: "true",
        });
      } else {
        return res.status(400).json({
          error: "Failed to add the Service!",
        });
      }
    } catch (error) {
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}
const getAllServices = async(req, res, next )=>{
 const services = await addrService.getAllServices();
 if (!services) {
   res.status(400).json({
     error: "Failed to get all services!",
   });
 } else {
    
   res.status(200).json(services
   );
 }
}

const getSingleService = async (req, res, next) => {
    const id = req.params.id;
  const singleService = await addrService.getServiceById(id);
  if (!singleService) {
    res.status(400).json({
      error: "Failed to get the service!",
    });
  } else {
    res.status(200).json(singleService);
  }
};

const updateServiceById = async (req, res, next) => {
  const id = req.params.id;
  const {service_name, service_description}= req.body;
  const updateService = await addrService.updateServiceById(
    id,
    service_name,
    service_description
  );

  if (!updateService) {
    res.status(400).json({
      error: "Failed to update  service!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

const deleteServiceById = async (req, res, next) => {
  const id = req.params.id;
  const removedService = await addrService.deleteServiceById(id);
  if (!removedService) {
    res.status(400).json({
      error: "Failed to delete this service!",
    });
  } else {
    res.status(200).json({ success: "true" });
  }
};


module.exports = {
  createService,
  getAllServices,
  getSingleService,
  updateServiceById,
  deleteServiceById,
};
