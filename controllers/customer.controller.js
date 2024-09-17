const customerService = require("../services/customer.service");

async function createCustomer (req, res, next) {
    console.log(req.body);

  // Check if email already exists in the database
  const customerExists = await customerService.checkIfCustomerExists(
    req.body.customer_email
  );
 if (customerExists) {
   res.status(400).json({
     error: "This email address is already associated with another customer!",
   });
 } else {
   try {
     const customerData = req.body;
     console.log(customerData);
     // Create the employee
     const customer = await customerService.createCustomer(customerData);
     if (customer !== null) {
       return res.status(200).json({
         status: "true",
       });
     } else {
       return res.status(400).json({
         error: "Failed to add the Customer!",
       });
     }
   } catch (error) {
     console.log(err);
     res.status(400).json({
       error: "Something went wrong!",
     });
   }
 }
}

// Create the getAllCustomer controller 
async function getAllCustomer(req, res, next) {
  // Call the getAllCustomer method from the employee service
  const customers = await customerService.getAllCustomer();
  // console.log(employees);
  if (!customers) {
    res.status(400).json({
      error: "Failed to get all employees!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: customers,
    });
  }
}
const getSingleCustomer = async (req, res, next) => {
  const id = req.params.id;
  const singleCustomer = await customerService.getCustomerByHash(id);
  if (!singleCustomer) {
    res.status(400).json({
      error: "Failed to get the service!",
    });
  } else {
    res.status(200).json(singleCustomer);
  }
};

const updateCustomerById = async (req, res, next) => {
  const id = req.params.id;
  console.log(req.body);
  const {
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    active_customer_status
  } = req.body;

  const updateCustomer = await customerService.amendCustomerByHash(
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    active_customer_status,
    id
  );

  if (!updateCustomer) {
    res.status(400).json({
      error: "Failed to update  service!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};



module.exports = {
  createCustomer,
  getAllCustomer,
  getSingleCustomer,
  updateCustomerById,
};
