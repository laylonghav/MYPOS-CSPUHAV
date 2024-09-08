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
      "INSERT INTO `category`( `Name`, `Description`, `Parent_id`, `Status`) VALUES (:Name, :Description, :Parent_id, :Status)";
    var param = {
      Name: req.body.Name,
      Description: req.body.Description,
      Parent_id: req.body.Parent_id,
      Status: req.body.Status,
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
      "UPDATE `category` SET `Name`=:Name,`Description`=:Description,`Status`=:Status WHERE id=:id";
    var param = {
      id: req.body.id,
      Name: req.body.Name,
      Description: req.body.Description,
      Parent_id: req.body.Parent_id,
      Status: req.body.Status,
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
