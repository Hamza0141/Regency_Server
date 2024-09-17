// Import the employee service 
const employeeService = require('../services/employee.service');
// Create the add employee controller

async function createEmployee(req, res, next) {
  // Check if employee email already exists in the database 
  const employeeExists = await employeeService.checkIfEmployeeExists(req.body.employee_email);
  // If employee exists, send a response to the client
  if (employeeExists) {
    res.status(400).json({
      error: "This email address is already associated with another employee!"
    });
  } else {
    try {
      const employeeData = req.body;
      // Create the employee
      const employee = await employeeService.createEmployee(employeeData);
      if (employee !== null) {
        return res.status(200).json({
          status: "true",
        });
      } else {
        return res.status(400).json({
          error: "Failed to add the employee!",
        });
      }
    } catch (error) {
      console.log(err);
      res.status(400).json({
        error: "Something went wrong!"
      });
    }
  }
}
// Create the getAllEmployees controller 
async function getAllEmployees(req, res, next) {
  // Call the getAllEmployees method from the employee service 
  const employees = await employeeService.getAllEmployees();
  // console.log(employees);
  if (!employees) {
    res.status(400).json({
      error: "Failed to get all employees!"
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employees,
    });
  }
}

const getSingleEmployee = async (req, res, next) => {
  const id = req.params.id;
  const singleEmployee = await employeeService.getEmployeeById(id);
  if (!singleEmployee) {
    res.status(400).json({
      error: "Failed to get the Employee!",
    });
  } else {
    res.status(200).json(singleEmployee);
  }
};
const updateEmployee = async (req, res, next) => {
  const id = req.params.id;
  const {
    employee_first_name,
    employee_last_name,
    employee_phone,
    active_employee,
    company_role_id,
  } = req.body;


  const updateEmployee = await employeeService.updateEmployeeById(
    id,
    employee_first_name,
    employee_last_name,
    employee_phone,
    active_employee,
    company_role_id,
  );

  if (!updateEmployee) {
    res.status(400).json({
      error: "Failed to update  service!",
    });
  } else {
    res.status(200).json({
      success: "true",
    });
  }
};

const deleteEmployeeById = async (req, res, next) => {
  const id = req.params.id;
  const removedEmployee = await employeeService.deleteEmployeeById(id);
  if (!removedEmployee) {
    res.status(400).json({
      error: "Failed to delete this Employee!",
    });
  } else {
    res.status(200).json({ success: "true" });
  }
};

const resetEmployeePassword = async (req, res, next) => {
  const employeeExists = await employeeService.checkIfEmployeeExists(
    req.body.employee_email
  );
  // check employee exist
    if (!employeeExists) {
      res.status(400).json({
        error: "Employee could't found!",
      });
    } else {
      try {
        const employee = await employeeService.employeePasswordReset(req.body);
        if (employee !== null) {
          return res.status(200).json({
            status: "true",
          });
        } else {
          return res.status(400).json({
            error: "Failed to Update employee password!",
          });
        }
      } catch (error) {
        console.log(err);
        res.status(400).json({
          error: "Something went wrong!",
        });
      }
    }

  
};

const changeEmployeePassword = async (req, res, next) => {
    try {
      const employee = await employeeService.employeePasswordChange(req.body);
      if (employee.status === "fail") {
        res.status(403).json({
          status: employee.status,
          message: employee.message,
        });
        // console.log(employee.message);
      } else if (employee !== null) {
        return res.status(200).json({
          status: "true",
          message: employee.message,
        });
      } else {
        return res.status(400).json({
          error: "Failed to Update employee password!",
        });
      }
    } catch (error) {
      console.log(err);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }

};


// Export the createEmployee controller 
module.exports = {
  createEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployeeById,
  resetEmployeePassword,
  changeEmployeePassword,
};