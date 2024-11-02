const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const { txtsearch } = req.query;

    // Base SQL query for employee retrieval with role name
    let sql = `SELECT * FROM customer WHERE 1`;

    // Dynamic query parameters
    const queryParams = {};

    // Add conditions dynamically based on parameters
    if (txtsearch) {
      sql +=
        " AND ( name LIKE :txtsearch OR email LIKE :txtsearch OR address LIKE :txtsearch)";
      queryParams.txtsearch = `%${txtsearch}%`;
    }

    // Add ORDER BY clause to sort by ID (e.g., descending)
    sql += " ORDER BY id DESC";

    // Execute the query with named placeholders
    const [data] = await db.query(
      { sql, namedPlaceholders: true },
      queryParams
    );

    // Send the response with the data
    res.json({
      I_know_you_are_ID: req.current_id,
      list: data,
    });
  } catch (error) {
    logError("customer.getlist", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    // Corrected SQL query
    var sql =
      "INSERT INTO `customer` (`name`, `tel`, `email`, `address`, `type`, `create_by`) VALUES " +
      "(:name, :tel, :email, :address, :type, :create_by)"; // Removed extra :create_by

    var param = {
      name: req.body.name,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.address,
      type: req.body.type,
      create_by: req.auth?.name, // Using optional chaining to safely access req.auth
    };

    // Executing the query
    const [result] = await db.query(sql, param);

    // Check if insertion was successful
    if (result.affectedRows > 0) {
      res.json({
        message: "Insert data successfully!",
        // Optionally, return the ID of the newly created customer if your DB supports it
        customerId: result.insertId, // If you want to return the new ID
      });
    } else {
      res.status(400).json({
        message: "Failed to insert data.",
      });
    }
  } catch (error) {
    // Handle the error properly
    logError("customer.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE `customer` SET `name`= :name, `tel`= :tel, `email`= :email, `address`= :address, `type`= :type WHERE `id` = :id";

    var param = {
      id: req.body.id,
      name: req.body.name,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.address,
      type: req.body.type,
    };

    const [data] = await db.query(sql, param); // Ensure db.query supports parameter binding
    res.json({
      data: data,
      message: "Update data successfully!",
    });
  } catch (error) {
    logError("customer.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var sql = "DELETE FROM `customer` WHERE id=:id";
    var param = {
      id: req.body.id,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Delete data successfully !",
    });
  } catch (error) {
    logError("customer.Delete", error, res);
  }
};
