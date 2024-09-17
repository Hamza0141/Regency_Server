// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// Import the bcrypt module
const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function checkIfCustomerExists(email) {
  const query = "SELECT * FROM customer_identifier WHERE customer_email = ? ";
  const rows = await conn.query(query, [email]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

async function createCustomer(customer) {
  let createdCustomer = null;
  try {
    // Generate a random string for customer_hash
    const customer_hash = crypto.randomBytes(10).toString("hex"); // Adjust the length of the random string as needed

    // Insert the data into the database
    const query =
      "INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)";
    const rows = await conn.query(query, [
      customer.customer_email,
      customer.customer_phone_number,
      customer_hash,
    ]);
  
    
    // Retrieve the customer_id from the insert
    const customer_id = rows.insertId;

    // Insert the remaining data into the customer_info table
    const query2 =
      "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)";
    await conn.query(query2, [
      customer_id,
      customer.customer_first_name,
      customer.customer_last_name,
      customer.active_customer_status,
    ]);

    // Construct the customer object to return
    createdCustomer = {
      customer_id: customer_id,
    };
  } catch (err) {
    console.log(err);
    createdCustomer = null;
  }
  return createdCustomer;
}

async function getAllCustomer() {
  const query =
    "SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id ORDER BY customer_identifier.customer_id DESC LIMIT 10";
  const rows = await conn.query(query);
  return rows;
}
const getCustomerByHash = async (hash) => {
  try {
    const query = `SELECT ci.customer_id,
       ci.customer_email,
       ci.customer_phone_number,
       ci.customer_added_date,
       ci.customer_hash,
       cinfo.customer_first_name,
       cinfo.customer_last_name,
       cinfo.active_customer_status,
       cinfo.customer_info_id
FROM customer_identifier AS ci
JOIN customer_info AS cinfo ON ci.customer_id = cinfo.customer_id
WHERE ci.customer_hash = ?;`;
    const rows = await conn.query(query, [hash]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};


const amendCustomerByHash = async (
  customer_phone_number,
  customer_first_name,
  customer_last_name,
  active_customer_status,
  hash
) => {
  try {
    // Update customer_phone_number in customer_identifier table
    const query1 = `UPDATE customer_identifier SET customer_phone_number = ? WHERE customer_hash = ?;`;
    const rows1 = await conn.query(query1, [customer_phone_number, hash]);
    console.log(rows1);

    // Update customer_first_name, customer_last_name, and active_customer_status in customer_info table
    const query2 = `
      UPDATE customer_info 
      SET customer_first_name = ?, customer_last_name = ?, active_customer_status = ? 
      WHERE customer_id = (SELECT customer_id FROM customer_identifier WHERE customer_hash = ?);
    `;
    const rows2 = await conn.query(query2, [
      customer_first_name,
      customer_last_name,
      active_customer_status,
      hash,
    ]);

    return rows2; // Return the result of the second query
  } catch (error) {
    console.log(error);
  }
};








module.exports = {
  checkIfCustomerExists,
  createCustomer,
  getAllCustomer,
  getCustomerByHash,
  amendCustomerByHash,
};