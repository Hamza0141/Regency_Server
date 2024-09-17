// Import the query function from the db.config.js file
// const { query } = require("express");
const conn = require("../config/db.config");

async function checkIfServiceExists(service_name) {
  const query = "SELECT * FROM common_services WHERE service_name = ? ";
  const rows = await conn.query(query, [service_name]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

const createService = async (service) => {
    let serviceId = ""
  try {
    const query =
      "INSERT INTO common_services (service_name, service_description) VALUES (?, ?)";
    const rows = await conn.query(query, [
      service.service_name,
      service.service_description,
    ]);
    return serviceId = rows.insertId;
  } catch (err) {
    console.log(err);
    serviceId = null;
  }
  return serviceId;
};

const getAllServices = async () => {
  try {
    const query = `SELECT * FROM common_services ORDER BY service_id DESC;`;
    const rows = await conn.query(query);
    console.log(rows);
    return rows

  } catch (error) {
    console.log(error);
  }
};

const getServiceById = async (serviceId) => {
  try {
    const query = `SELECT * FROM common_services WHERE service_id = ?;`;
    const rows = await conn.query(query, [serviceId]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const updateServiceById = async (id, service_name, service_description) => {
  try {
    const query = `UPDATE common_services SET service_name = ?, service_description = ?
    WHERE service_id = ?;`;
    const rows = await conn.query(query, [
        service_name,
        service_description,
        id,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const deleteServiceById = async (serviceId) => {
  try {
    const query = `DELETE  FROM common_services WHERE service_id = ?;`;
    const rows = await conn.query(query, [serviceId]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};




module.exports = {
  checkIfServiceExists,
  createService,
  getAllServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
};
