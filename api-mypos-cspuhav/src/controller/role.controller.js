const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM `role` ORDER BY id DESC");
    res.json({
      I_know_you_are_ID: req.current_id,
      list: data, // Use 'data' here instead of 'list'
    });
  } catch (error) {
    logError("role.getlist", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO `role`( `Name`, `code`, `status`) VALUES (:Name, :code, :status)";
    var param = {
      Name: req.body.Name,
      code: req.body.code,
      status: req.body.status,
    };
    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Insert data successfully !",
    });
  } catch (error) {
    logError("role.create", error, res);
  }
};
exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE `role` SET `id`=:id,`Name`=:Name,`code`=:code,`status`=:status WHERE id=:id";
    var param = {
      id: req.body.id,
      Name: req.body.Name,
      code: req.body.code,
      status: req.body.status,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Update data successfully !",
    });
  } catch (error) {
    logError("role.Delete", error, res);
  }
};
exports.remove = async (req, res) => {
  try {
    var sql = "DELETE FROM `role` WHERE id=:id";
    var param = {
      id: req.body.id,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Delete data successfully !",
    });
  } catch (error) {
    logError("role.Delete", error, res);
  }
};
