const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const { txtsearch, supplier, status } = req.query;

    // Base SQL query for expense retrieval with role name
    let sql = `
      SELECT p.*, 
             s.name AS supplier_name
      FROM purchase p
      INNER JOIN supplier s 
        ON p.supplier_id = s.id
      WHERE 1
    `;

    // Dynamic query parameters
    const queryParams = {};

    // Add conditions dynamically based on parameters
    if (txtsearch) {
      sql += `
        AND ( p.ref LIKE :txtsearch 
             OR p.ship_company LIKE :txtsearch)
      `;
      queryParams.txtsearch = `%${txtsearch}%`;
    }
    if (supplier) {
      sql += " AND p.supplier_id = :supplier";
      queryParams.supplier = supplier;
    }
    if (status) {
      sql += " AND p.status = :status";
      queryParams.status = status;
    }

    // Add ORDER BY clause to sort by ID in descending order
    sql += " ORDER BY p.id DESC";

    // Execute the query with named placeholders
    const [data] = await db.query(
      { sql, namedPlaceholders: true },
      queryParams
    );

    // Send the response with the data
    res.json({
      list: data,
    });
  } catch (error) {
    logError("purchase.getlist", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    const sql =
      "INSERT INTO `purchase`(`supplier_id`, `ref`, `ship_company`, `ship_cost`, `paid_amount`, `paid_date`, `status`, `create_by`) VALUES " +
      "(:supplier_id, :ref, :ship_company, :ship_cost, :paid_amount, :paid_date, :status, :create_by)";

    const param = {
      supplier_id: req.body.supplier_id,
      ref: req.body.ref,
      ship_company: req.body.ship_company,
      ship_cost: req.body.ship_cost,
      paid_amount: req.body.paid_amount,
      paid_date: req.body.paid_date,
      status: req.body.status,
      create_by: req.auth?.name,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Data inserted successfully!",
    });
  } catch (error) {
    logError("purchase.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    const sql =
      "UPDATE `purchase` SET `supplier_id`= :supplier_id, `ref`= :ref, `ship_company`= :ship_company, `ship_cost`= :ship_cost, `paid_amount`= :paid_amount, `paid_date`= :paid_date, `status`= :status " +
      "WHERE `id` = :id";

    const param = {
      id: req.body.id,
      supplier_id: req.body.supplier_id,
      ref: req.body.ref,
      ship_company: req.body.ship_company,
      ship_cost: req.body.ship_cost,
      paid_amount: req.body.paid_amount,
      paid_date: req.body.paid_date,
      status: req.body.status,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Data updated successfully!",
    });
  } catch (error) {
    logError("purchase.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    const sql = "DELETE FROM `purchase` WHERE id = :id";
    const param = { id: req.body.id };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Data deleted successfully!",
    });
  } catch (error) {
    logError("purchase.remove", error, res);
  }
};

exports.newRef = async (req, res) => {
  try {
    const sql =
      "SELECT CONCAT('PUR', LPAD(COALESCE(MAX(id), 0) + 1, 3, '0')) AS ref FROM purchase";
    const [data] = await db.query(sql);
    res.json({
      ref: data[0].ref,
    });
  } catch (error) {
    logError("purchase.newref", error, res);
  }
};
