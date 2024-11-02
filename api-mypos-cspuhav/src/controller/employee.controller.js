const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const { txtsearch, position } = req.query;

    // Base SQL query for employee retrieval with role name
    let sql = `
      SELECT e.*, 
             r.Name AS role_name
      FROM employee e
      INNER JOIN role r 
        ON e.role_id = r.id
      WHERE 1
    `;

    // Dynamic query parameters
    const queryParams = {};

    // Add conditions dynamically based on parameters
    if (txtsearch) {
      sql +=
        " AND (e.firstname LIKE :txtsearch OR e.lastname LIKE :txtsearch OR e.email LIKE :txtsearch)";
      queryParams.txtsearch = `%${txtsearch}%`;
    }
    if (position) {
      sql += " AND e.role_id = :position";
      queryParams.position = position;
    }

    // Add ORDER BY clause to sort by ID (e.g., descending)
    sql += " ORDER BY e.id DESC";

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
    logError("employee.getlist", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO `employee`(`firstname`, `lastname`, `card_id`, `dob`, `gender`, " +
      "`tel`, `email`, `base_salary`, `role_id`, `address`, `status`, `create_by`) VALUES  " +
      "(:firstname, :lastname, :card_id, :dob, :gender, :tel, :email, :base_salary," +
      " :role_id, :address,:status, :create_by)";
    var param = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      card_id: req.body.card_id,
      dob: req.body.dob,
      gender: req.body.gender,
      tel: req.body.tel,
      email: req.body.email,
      base_salary: req.body.base_salary,
      role_id: req.body.role_id,
      address: req.body.address,
      status: req.body.status,
      create_by: req.auth?.name,
    };
    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Insert data successfully !",
    });
  } catch (error) {
    logError("employee.create", error, res);
  }
};
exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE `employee` SET " +
      "`firstname` = :firstname, " +
      "`lastname` = :lastname, " +
      "`card_id` = :card_id, " +
      "`dob` = :dob, " +
      "`gender` = :gender, " +
      "`tel` = :tel, " +
      "`email` = :email, " +
      "`base_salary` = :base_salary, " + // Corrected: changed `:` to `=`
      "`role_id` = :role_id, " + // Corrected the placement of the `=`
      "`address` = :address, " +
      "`status` = :status " +
      "WHERE `id` = :id"; // Removed extra comma before WHERE clause

    var param = {
      id: req.body.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      card_id: req.body.card_id,
      dob: req.body.dob,
      gender: req.body.gender,
      tel: req.body.tel,
      email: req.body.email,
      base_salary: req.body.base_salary,
      role_id: req.body.role_id,
      address: req.body.address,
      status: req.body.status,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Update data successfully !",
    });
  } catch (error) {
    logError("employee.update", error, res);
  }
};
exports.remove = async (req, res) => {
  try {
    var sql = "DELETE FROM `employee` WHERE id=:id";
    var param = {
      id: req.body.id,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Delete data successfully !",
    });
  } catch (error) {
    logError("employee.Delete", error, res);
  }
};
