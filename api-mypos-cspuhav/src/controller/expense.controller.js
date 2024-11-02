const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const { txtsearch, expense_type } = req.query;

    // Base SQL query for expense retrieval with role name
    let sql = `
      SELECT e.*, 
             et.name AS expense_name
      FROM expense e
      INNER JOIN expense_type et 
        ON e.expense_type_id = et.id
      WHERE 1
    `;

    // Dynamic query parameters
    const queryParams = {};

    // Add conditions dynamically based on parameters
    if (txtsearch) {
      sql += " AND (e.ref_no LIKE :txtsearch OR e.name LIKE :txtsearch )";
      queryParams.txtsearch = `%${txtsearch}%`;
    }
    if (expense_type) {
      sql += " AND e.expense_type_id = :expense_type";
      queryParams.expense_type = expense_type;
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
    logError("expense.getlist", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO `expense`(`expense_type_id`, `ref_no`, `name`, `amount`, `remark`, `expense_date`, `create_by`) VALUES " +
      "(:expense_type_id, :ref_no, :name, :amount, :remark, :expense_date, :create_by)";

    var param = {
      expense_type_id: req.body.expense_type_id,
      ref_no: req.body.ref_no,
      name: req.body.name,
      amount: req.body.amount,
      remark: req.body.remark,
      expense_date: req.body.expense_date,
      create_by: req.auth?.name,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Insert data successfully !",
    });
  } catch (error) {
    logError("expense.create", error, res);
  }
};
exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE `expense` SET `expense_type_id`= :expense_type_id ,`ref_no`= :ref_no ,`name`= :name ,`amount`= :amount ,`remark`= :remark ,`expense_date`= :expense_date " +
      "WHERE `id` = :id"; // Removed extra comma before WHERE clause

    var param = {
      id: req.body.id,
      expense_type_id: req.body.expense_type_id,
      ref_no: req.body.ref_no,
      name: req.body.name,
      amount: req.body.amount,
      remark: req.body.remark,
      expense_date: req.body.expense_date,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Update data successfully !",
    });
  } catch (error) {
    logError("expense.update", error, res);
  }
};
exports.remove = async (req, res) => {
  try {
    var sql = "DELETE FROM `expense` WHERE id=:id";
    var param = {
      id: req.body.id,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Delete data successfully !",
    });
  } catch (error) {
    logError("expense.Delete", error, res);
  }
};

exports.newRef_no = async (req, res) => {
  try {
    var sql =
      "SELECT " +
      "CONCAT('EXP',LPAD((SELECT COALESCE(MAX(id),0) + 1 FROM expense), 3, '0')) " +
      "as ref_no";
    var [data] = await db.query(sql);
    res.json({
      ref_no: data[0].ref_no,
    });
  } catch (error) {
    logError("ref_no.create", error, res);
  }
};
