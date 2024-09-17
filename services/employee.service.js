// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// Import the bcrypt module
const bcrypt = require("bcrypt");
// A function to check if employee exists in the database
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email = ? ";
  const rows = await conn.query(query, [email]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new employee
async function createEmployee(employee) {
  let createdEmployee = null;
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt,);
    // Insert the email in to the employee table
    const query =
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const rows = await conn.query(query, [
      employee.employee_email,
      employee.active_employee,
    ]);
    if (rows.affectedRows !== 1) {
      return false;
    }

    // Get the employee id from the insert
    const employee_id = rows.insertId;
    // Insert the remaining data in to the employee_info, employee_pass, and employee_role tables
    const query2 =
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)";
    const rows2 = await conn.query(query2, [
      employee_id,
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
    ]);
    const query3 =
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)";
    const rows3 = await conn.query(query3, [employee_id, hashedPassword]);
    const query4 =
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)";
    const rows4 = await conn.query(query4, [
      employee_id,
      employee.company_role_id,
    ]);
    // construct to the employee object to return
    createdEmployee = {
      employee_id: employee_id,
    };
  } catch (err) {
    console.log(err);
    createdEmployee = null;
  }
  // Return the employee object
  return createdEmployee;
}

// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const rows = await conn.query(query, [employee_email]);
  return rows;
}
const getEmployeeById = async (id) => {
  try {
    const query = `SELECT ei.employee_first_name, ei.employee_last_name, ei.employee_phone,e.employee_id, e.employee_email, ae.active_employee
FROM employee_info ei
JOIN employee e ON ei.employee_id = e.employee_id
JOIN employee ae ON e.employee_id = ae.employee_id
WHERE ei.employee_id = ?;`;
    const rows = await conn.query(query, [id]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

// A function to get all employees
async function getAllEmployees() {
  const query = "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id ORDER BY employee.employee_id DESC limit 10";
  const rows = await conn.query(query);
  return rows;
}

const updateEmployeeById = async (
  id,
  employee_first_name,
  employee_last_name,
  employee_phone,
  active_employee,
  company_role_id
) => {
  try {
    // updating active_employee of the employee
    const query1 =
      "UPDATE employee SET active_employee = ? WHERE employee_id = ?;";
    const rows1 = await conn.query(query1, [active_employee, id]);
    
    // updating company_role_id of the employee
    const query2 =
      "UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?;";
    const rows2 = await conn.query(query2, [company_role_id, id]);

    if (rows1.affectedRows && rows2.affectedRows) {
      const query =
        "UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?;";
      const rows = await conn.query(query, [
        employee_first_name,
        employee_last_name,
        employee_phone,
        id,
      ]);
      return rows;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteEmployeeById = async (id) => {
  try {
    // First, delete records from child tables
    await conn.query("DELETE FROM employee_info WHERE employee_id = ?", [id]);
    await conn.query("DELETE FROM employee_pass WHERE employee_id = ?", [id]);
    await conn.query("DELETE FROM employee_role WHERE employee_id = ?", [id]);
    await conn.query("DELETE FROM orders WHERE employee_id = ?", [id]);

    // Then, delete the record from the employee table
    const query = "DELETE FROM employee WHERE employee_id = ?";
    const result = await conn.query(query, [id]);

    return result;
  } catch (error) {
    console.log(error);
  }
};

const employeePasswordReset = async (data)=>{
    try{
  const { employee_id, employee_password } = data;
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  const hashedPassword = await bcrypt.hash(employee_password, salt);
  const query =
       "UPDATE employee_pass SET employee_password_hashed = ? WHERE employee_id = ?";
     const rows1 = await conn.query(query, [hashedPassword, employee_id]);

  }catch (error) {
    console.log(error);
  }
   
    
}

const employeePasswordChange = async (employeeData) => {
  try {
    let returnData = {}; // Object to be returned
    const employee = await getEmployeeByEmail(employeeData.employee_email);
    if (employee.length === 0) {
      returnData = {
        status: "fail",
        message: "Employee does not exist",
      };
      return returnData;
    }
    const passwordMatch = await bcrypt.compare(
      employeeData.existing_Password,
      employee[0].employee_password_hashed
    );
    if (!passwordMatch) {
      returnData = {
        status: "fail",
        message: "Incorrect password",
      };
      return returnData;
    }
    const { employee_id, new_employee_password } = employeeData;
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(new_employee_password, salt);
const query =
  "UPDATE employee_pass SET employee_password_hashed = ? WHERE employee_id = ?";
const rows1 = await conn.query(query, [hashedPassword, employee_id]);
    returnData = {
      status: "success",
      message: "Password Successfully Changed",
    };
    return returnData;
  } catch (error) {
    console.log(error);
  }
};

// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getEmployeeById,
  getAllEmployees,
  updateEmployeeById,
  deleteEmployeeById,
  employeePasswordReset,
  employeePasswordChange,
};
