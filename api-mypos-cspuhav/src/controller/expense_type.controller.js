const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const { txtsearch, expense_type } = req.query;

    // Base SQL query for expense retrieval with role name
    let sql = `
      SELECT * 
      FROM expense_type 
      WHERE 1
    `;

    // Dynamic query parameters
    const queryParams = {};

    // Add conditions dynamically based on parameters
    if (txtsearch) {
      sql +=
        "AND (name LIKE :txtsearch OR code LIKE :txtsearch )";
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
    logError("expense_type.getlist", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO `expense_type`(`name`, `code`, `create_by`) VALUES " +
      "(:name, :code,:create_by )";
    var param = {
      name: req.body.name,
      code: req.body.code,
      create_by: req.auth?.name,
    };
    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Insert data successfully !",
    });
  } catch (error) {
    logError("expense_type.create", error, res);
  }
};
exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE `expense_type` SET `name`= :name ,`code`= :code " +
      "WHERE `id` = :id"; // Removed extra comma before WHERE clause

    var param = {
      id: req.body.id,
      name: req.body.name,
      code: req.body.code,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Update data successfully !",
    });
  } catch (error) {
    logError("expense_type.update", error, res);
  }
};
exports.remove = async (req, res) => {
  try {
    var sql = "DELETE FROM `expense_type` WHERE id=:id";
    var param = {
      id: req.body.id,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Delete data successfully !",
    });
  } catch (error) {
    logError("expense_type.Delete", error, res);
  }
};
