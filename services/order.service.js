const conn = require("../config/db.config");
const crypto = require("crypto");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const addOrder = async (orderInfo) => {
  try {



    const order_hash = crypto.randomBytes(10).toString("hex");
    // Insert into orders table
    const query1 = `
      INSERT INTO orders 
      (employee_id, customer_id, vehicle_id, order_hash,assigned_employee_id) 
      VALUES (?, ?, ?, ?,?)
    `;
    const params1 = [
      orderInfo.employee_id,
      orderInfo.customer_id,
      orderInfo.vehicle_id,
      order_hash,
      orderInfo.assigned_employee_id,
    ];
    const rows1 = await conn.query(query1, params1);
    const order_id = rows1.insertId;
    
    // Insert into order_info table
    const query2 = `
    INSERT INTO order_info 
    (order_id, order_total_price, additional_request) 
    VALUES (?, ?, ?)
    `;
    const params2 = [
      order_id,
      orderInfo.order_total_price,
      orderInfo.additional_request,
    ];
    const rows2 = await conn.query(query2, params2);


        console.log("params for service ids" + orderInfo.service_ids);

    // Insert into order_services table for each service ID
    for (const service_id of orderInfo.service_ids) {
      const query3 = `
        INSERT INTO order_services 
        (order_id, service_id, service_status) 
        VALUES (?, ?, ?)
      `;
      const params3 = [order_id, service_id, orderInfo.service_status];
      const rows3 = await conn.query(query3, params3);
    }

    // Insert into order_status table
    const query4 = `
      INSERT INTO order_status 
      (order_id, order_status) 
      VALUES (?, ?)
    `;
    const params4 = [
      order_id,
      orderInfo.order_status, // Assuming you have an order status in orderInfo
    ];
    const rows4 = await conn.query(query4, params4);
if(rows4){
  mg.messages
    .create(`${process.env.MAILGUN_DOMAIN}`, {
      from: `Regency Auto Repair <${process.env.MAILGUN_REPLIES}>`,
      to: [`${orderInfo.customer_email}`],
      subject: "Thank You for Your Order!",
      text: "Thankyou for choosing us!",
      html: `<div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
  <h1 style="color: #4CAF50; font-size: 36px; margin-bottom: 20px;">Thank You for Choosing Regency Auto Repair!</h1>
  <p style="font-size: 18px; margin-bottom: 30px;">
    We truly appreciate your trust in our service. Your vehicle is in expert hands!
  </p>
  <p style="font-size: 16px; margin-bottom: 40px;">
    You can easily check your order progress by clicking the button below:
  </p>
  <a href="http://regencyautorepair.com/customer/order/detail/${order_hash}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 18px; border-radius: 5px;">
    View Order Progress
  </a>
  <p style="margin-top: 40px; font-size: 14px; color: #666;">
    If you have any questions, feel free to <a href="mailto:replies@regencyautorepair.com" style="color: #4CAF50;">contact us</a>.
  </p>
</div>`,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err));

}
    // Return true if all queries are successful
    return true;
  } catch (err) {
    console.error("Error creating order:", err);
    return false;
  }
};


const updateOrderInfo = async (orderId, orderUpdates) => {
  try {
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
    const params = [
      orderUpdates.order_total_price,
      orderUpdates.completion_date,
      orderUpdates.additional_request,
      orderUpdates.notes_for_internal_use,
      orderUpdates.notes_for_customer,
      orderId,
    ];
    await conn.query(query, params);
    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating order info:", error);
    return false;
  }
};



const updateOrderStatus = async (orderId, orderStatus, customer_email) => {
    console.log("hii", orderId, orderStatus, customer_email);
  try {
    const query = `
      UPDATE order_status 
      SET 
        order_status = ?
      WHERE order_id = ?
    `;
    const params = [orderStatus, orderId];
    await conn.query(query, params);
    return true; // Indicate successful update
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};

const updateOrderServices = async (orderId, serviceUpdates) => {
    for (const serviceUpdate of serviceUpdates) {
      await updateOrderServiceStatus(
        orderId,
        serviceUpdate.serviceId,
        serviceUpdate.serviceStatus
      );
    }
};

// const updateOrderByHash = async (orderHash, orderUpdates) => {

//   try {
//     // Retrieve the order ID associated with the provided hash
//     const query1 = `
//       SELECT order_id 
//       FROM orders 
//       WHERE order_hash = ?
//     `;
//     const [orderRow] = await conn.query(query1, [orderHash]);
//     const orderId = orderRow.order_id;

//     // Update order info
//     if (orderUpdates.orderInfo) {
//       await updateOrderInfo(orderId, orderUpdates.orderInfo);
//     }

//     // Update order status
//     if (orderUpdates.orderStatus) {
//       await updateOrderStatus(
//         orderId,
//         orderUpdates.orderStatus,
//         orderUpdates.customer_email
//       );
//     }

//     // Update order services
//     if (orderUpdates.serviceUpdates) {
//       await updateOrderServices(orderId, orderUpdates.serviceUpdates);
//     }

//     return true; // Indicate successful update
//   } catch (error) {
//     console.error("Error updating order:", error);
//     return false;
//   }
// };



const getOrderByHas = async (orderHash) => {
  try {
    const query = `SELECT
    ci.customer_phone_number,
    ci.customer_email,
    ci_info.customer_first_name,
    ci_info.customer_last_name,
    cvi.vehicle_make,
    cvi.vehicle_year,
    cvi.vehicle_model,
    cvi.vehicle_tag,
    cvi.vehicle_mileage,
    oi.order_total_price,
    oi.completion_date,
    oi.additional_request,
    oi.notes_for_internal_use,
    oi.notes_for_customer,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'service_id', cs.service_id,
            'service_Name', cs.service_name,
            'service_dec', cs.service_description,
            'service_status', osr.service_status
        )
    ) AS services,
    os.order_status,
    ei.employee_first_name,
    ei.employee_last_name,
    o.order_date
FROM
    orders o
JOIN
    customer_identifier ci ON o.customer_id = ci.customer_id
JOIN
    customer_info ci_info ON ci.customer_id = ci_info.customer_id
JOIN
    customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
JOIN
    order_info oi ON o.order_id = oi.order_id
JOIN
    order_services osr ON o.order_id = osr.order_id
JOIN
    common_services cs ON osr.service_id = cs.service_id
JOIN
    order_status os ON o.order_id = os.order_id
JOIN
    employee_info ei ON o.employee_id = ei.employee_id
WHERE
    o.order_hash = ?
GROUP BY
    o.order_id,
    ci.customer_phone_number,
    ci.customer_email,
    ci_info.customer_first_name,
    ci_info.customer_last_name,
    cvi.vehicle_make,
    cvi.vehicle_year,
    cvi.vehicle_model,
    cvi.vehicle_tag,
    cvi.vehicle_mileage,
    oi.order_total_price,
    oi.completion_date,
    oi.additional_request,
    oi.notes_for_internal_use,
    oi.notes_for_customer,
    os.order_status,
    ei.employee_first_name,
    ei.employee_last_name,
    o.order_date;
`;
    const rows = await conn.query(query, [orderHash]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const getAllOrders = async () => {
  try {
    const query = `SELECT
      o.*,
      ci.customer_email,
      ci.customer_phone_number,
      cif.customer_first_name,
      cif.customer_last_name,
      cvi.vehicle_make,
      cvi.vehicle_year,
      cvi.vehicle_model,
      cvi.vehicle_tag,
      o.order_date,
      ei.employee_first_name,
      ei.employee_last_name,
      assigned_ei.employee_first_name AS assigned_employee_first_name,
      assigned_ei.employee_last_name AS assigned_employee_last_name,
      os.order_status
    FROM
      orders o
    JOIN
      customer_identifier ci ON o.customer_id = ci.customer_id
    JOIN
      customer_info cif ON ci.customer_id = cif.customer_id
    JOIN
      customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    JOIN
      employee_info ei ON o.employee_id = ei.employee_id
    JOIN
      employee_info assigned_ei ON o.assigned_employee_id = assigned_ei.employee_id
    JOIN
      order_status os ON o.order_id = os.order_id
    ORDER BY o.order_id DESC;

`;
    const rows = await conn.query(query);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const getOrdersByCustomerHash = async (customerHash) => {
  try {
    const query = `
      SELECT
        o.*,
        ci.customer_email,
        ci.customer_phone_number,
        cif.customer_first_name,
        cif.customer_last_name,
        cvi.vehicle_make,
        cvi.vehicle_year,
        cvi.vehicle_model,
        cvi.vehicle_tag,
        o.order_date,
        ei.employee_first_name,
        ei.employee_last_name,
        os.order_status
      FROM
        orders o
      JOIN
        customer_identifier ci ON o.customer_id = ci.customer_id
      JOIN
        customer_info cif ON ci.customer_id = cif.customer_id
      JOIN
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      JOIN
        employee_info ei ON o.employee_id = ei.employee_id
      JOIN
        order_status os ON o.order_id = os.order_id
      WHERE
        ci.customer_hash = ?
      ORDER BY
        o.order_id DESC;
    `;
    const rows = await conn.query(query, [customerHash]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  addOrder,
  // updateOrderByHash,
  getOrderByHas,
  getAllOrders,
  getOrdersByCustomerHash,
};
