const conn = require("../config/db.config");
const crypto = require("crypto");

const updateOrderInfo = async (id, orderUpdates) => {
  console.log(orderUpdates);
  try {
    // Query to find order_id based on order_hash
    const query1 = `
            SELECT order_id 
            FROM orders 
            WHERE order_hash = ?
        `;
    // Execute the query and await its result
    const [orderRow] = await conn.query(query1, [id]);
    const orderId = orderRow.order_id;
    console.log("number id " + orderRow);

    // Query to update order_info table
    const query = `
            UPDATE order_info 
            SET 
                order_total_price = ?, 
                completion_date = ?, 
                additional_request = ?, 
                notes_for_internal_use = ?, 
                notes_for_customer = ?
            WHERE order_id = ?
        `;
    // Extract values from orderUpdates object and append orderId
    const params = [
      orderUpdates.order_total_price,
      orderUpdates.completion_date,
      orderUpdates.additional_request,
      orderUpdates.notes_for_internal_use,
      orderUpdates.notes_for_customer,
      orderId,
    ];
    // Execute the update query
    const row = await conn.query(query, params);
    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating order info:", error);
    return false;
  }
};


const updateOrderStatus = async (orderHash, newStatus) => {
  try {
    // Find order_id based on order_hash
    const query1 = `
            SELECT order_id 
            FROM orders 
            WHERE order_hash = ?
        `;
    const [orderRow] = await conn.query(query1, [orderHash]);
    const orderId = orderRow.order_id;

    // Update order status
    const query2 = `
            UPDATE order_status 
            SET 
                order_status = ?
            WHERE order_id = ?
        `;
    const params = [newStatus.order_status, orderId];
    const result = await conn.query(query2, params);

    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};

const updateOrderServiceId = async (orderHash, data) => {
  console.log(orderHash, data);
  try {
    // Find order_id based on order_hash
    const query1 = `
            SELECT order_id 
            FROM orders 
            WHERE order_hash = ?
        `;
    const [orderRow] = await conn.query(query1, [orderHash]);
    const orderId = orderRow.order_id;


    // Update service ID in the order_services table
    const query = `
            UPDATE order_services 
            SET 
                service_id = ?
            WHERE order_id = ? AND service_id = ?
        `;
    const params = [data.new_service_id, orderId, data.service_id];
    const result = await conn.query(query, params);

    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating order service:", error);
    return false;
  }
};
const updateServiceStatuses = async (orderHash, serviceStatusUpdates) => {
  console.log(serviceStatusUpdates);
  try {
    // Find order_id based on order_hash
    const query1 = `
            SELECT order_id 
            FROM orders 
            WHERE order_hash = ?
        `;
    const [orderRow] = await conn.query(query1, [orderHash]);
    const orderId = orderRow.order_id;
      console.log(orderId);

    // Update service statuses for each service ID
    for (const update of serviceStatusUpdates) {
      const { serviceId, serviceStatus } = update;

      const query2 = `
                UPDATE order_services 
                SET 
                    service_status = ?
                WHERE order_id = ? AND service_id = ?
            `;
      const params = [serviceStatus, orderId, serviceId];
      await conn.query(query2, params);
    }

    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating service statuses:", error);
    return false;
  }
};

const updateNotesForInternal = async (orderHash, data) => {
    const { notes_for_internal_use } = data;
  try {
    // Find order_id based on order_hash
    const query1 = `
            SELECT order_id 
            FROM orders 
            WHERE order_hash = ?
        `;
    const [orderRow] = await conn.query(query1, [orderHash]);
    const orderId = orderRow.order_id;
    console.log(orderId);

      const query2 = `
                UPDATE order_info 
                SET 
                    notes_for_internal_use = ?
                WHERE order_id = ?
            `;
      const params = [notes_for_internal_use, orderId];
      await conn.query(query2, params);


    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating service statuses:", error);
    return false;
  }
};
const updateNotesForCustomer = async (orderHash, data) => {
  console.log(data);
  try {
    // Find order_id based on order_hash
    const query1 = `
            SELECT order_id 
            FROM orders 
            WHERE order_hash = ?
        `;
    const [orderRow] = await conn.query(query1, [orderHash]);
    const orderId = orderRow.order_id;
    console.log(orderId);

    const query2 = `
                UPDATE order_info 
                SET 
                    notes_for_customer = ?
                WHERE order_id = ?
            `;
    const params = [data.notes_for_customer, orderId];
    await conn.query(query2, params);

    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating service statuses:", error);
    return false;
  }
};


module.exports = {
  updateOrderInfo,
  updateOrderStatus,
  updateOrderServiceId,
  updateServiceStatuses,
  updateNotesForInternal,
  updateNotesForCustomer,
};
