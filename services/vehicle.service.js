const conn = require("../config/db.config");

async function checkIfVehicleExists(vehicleInfo) {
  try {
    // check the vehicle
    const query = `
      SELECT * 
      FROM customer_vehicle_info 
      WHERE 
        customer_id = ? AND
        vehicle_year = ? AND
        vehicle_make = ? AND
        vehicle_model = ? AND
        vehicle_type = ? AND
        vehicle_mileage = ? AND
        vehicle_tag = ? AND
        vehicle_serial = ? AND
        vehicle_color = ?
    `;
    //distracting the req.body's value using object contractor
  const params = Object.values(vehicleInfo);

    const rows = await conn.query(query, params);
 if (rows.length > 0) {
   return true;
 }
   return false;

  } catch (error) {
    console.error("Error checking if vehicle exists:", error);
  return false;
  }
}

const createVehicle = async (vehicleInfo) => {

  try {
    const query = `
      INSERT INTO customer_vehicle_info 
      (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, 
      vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    //distracting the req.body's value using object contractor
    const params = Object.values(vehicleInfo);


    const rows = await conn.query(query, params);
    // Check if the insert operation was successful
    return rows.affectedRows === 1;
  } catch (err) {
    console.error("Error creating vehicle:", err);
    return false;
  }
};

const updateVehicleById = async (id ,vehicleInfo) => {
 if (!vehicleInfo || Object.values(vehicleInfo).some((value) => value === "")) {
   return; // Return early if vehicleInfo is null or any field has an empty value
 }
  try {
    const query = `UPDATE customer_vehicle_info SET vehicle_year = ?, vehicle_make = ?, vehicle_model = ?, vehicle_type = ?, vehicle_mileage = ?, vehicle_tag = ?, vehicle_serial = ?, vehicle_color = ?
    WHERE vehicle_id = ?;`;

    const params = [...Object.values(vehicleInfo), id]; // Spread the values of vehicleInfo and append id
    const rows = await conn.query(query, params);
    return rows;
  } catch (error) {
    console.log(error);
  }
};


const getCustomerVehicleByCustomerId = async (id) => {
  try {
    const query = `SELECT * FROM customer_vehicle_info WHERE customer_id = ?;`;
    const rows = await conn.query(query, [id]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};
const getCustomerVehicleByCustomerHash = async (customer_hash) => {
  try {
    const query1 = `
            SELECT customer_id 
            FROM customer_identifier 
            WHERE customer_hash = ?
        `;
    const [orderRow] = await conn.query(query1, [customer_hash]);
    const customerId = orderRow.customer_id;

    const query = `SELECT * FROM customer_vehicle_info WHERE customer_id = ?;`;
    const rows = await conn.query(query, [customerId]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const getVehicleByVehicleId = async (id) => {
  try {
    const query = `SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?;`;
    const rows = await conn.query(query, [id]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  checkIfVehicleExists,
  createVehicle,
  updateVehicleById,
  getCustomerVehicleByCustomerId,
  getCustomerVehicleByCustomerHash,
  getVehicleByVehicleId,
};