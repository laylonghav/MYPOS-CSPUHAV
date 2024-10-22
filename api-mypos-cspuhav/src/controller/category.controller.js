const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM `category` ORDER BY id DESC");
    res.json({
      I_know_you_are_ID: req.current_id,
      list: data, // Use 'data' here instead of 'list'
    });
  } catch (error) {
    logError("category.getlist", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO `category`( `name`, `description`, `Parent_id`, `status`) VALUES (:name, :description, :Parent_id, :status)";
    var param = {
      name: req.body.name,
      description: req.body.description,
      parent_id: req.body.parent_id,
      status: req.body.status,
    };
    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Insert data successfully !",
    });
  } catch (error) {
    logError("category.create", error, res);
  }
};
exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE `category` SET `name`=:name,`description`=:description,`status`=:status WHERE id=:id";
    var param = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      parent_id: req.body.parent_id,
      status: req.body.status,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Update data successfully !",
    });
  } catch (error) {
    logError("category.Delete", error, res);
  }
};
exports.remove = async (req, res) => {
  try {
    var sql = "DELETE FROM `category` WHERE id=:id";
    var param = {
      id: req.body.id,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Delete data successfully !",
    });
  } catch (error) {
    logError("category.Delete", error, res);
  }
};
