const { db, logError, isEmpty } = require("../util/helper");


exports.getlist = async (req, res) => {
  try {
    const {txtsearch} = req.query; // Extract the 'name' parameter from the query string
    let sql = "SELECT * FROM `supplier` ORDER BY id DESC";

    if (txtsearch) {
      sql =
        "SELECT * FROM `supplier` WHERE name LIKE :txtsearch ORDER BY id DESC";
    }

    const [data] = await db.query(sql, {
      txtsearch: `%${txtsearch}%`,
    });

    res.json({
      I_know_you_are_ID: req.current_id,
      list: data,
    });
  } catch (error) {
    logError("supplier.getlist", error, res);
  }
};


exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO `supplier`(`name`, `code`, `tel`, `email`, `address`, `website`, `note`, `create_by`) VALUES (:name, :code, :tel, :email,:address,:website,:note,:create_by)";
    var param = {
      name: req.body.name,
      code: req.body.code,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.email,
      website: req.body.website,
      note: req.body.note,
      create_by: req.auth?.name,
    };
    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Insert data successfully !",
    });
  } catch (error) {
    logError("supplier.create", error, res);
  }
};
exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE `supplier` SET `name`=:name,`code`=:code,`tel`=:tel,`email`=:email,`address`=:address,`website`=:website,`note`=:note WHERE id=:id";
    var param = {
      id: req.body.id,
      name: req.body.name,
      code: req.body.code,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.email,
      website: req.body.website,
      note: req.body.note,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Update data successfully !",
    });
  } catch (error) {
    logError("supplier.Delete", error, res);
  }
};
exports.remove = async (req, res) => {
  try {
    var sql = "DELETE FROM `supplier` WHERE id=:id";
    var param = {
      id: req.body.id,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Delete data successfully !",
    });
  } catch (error) {
    logError("supplier.Delete", error, res);
  }
};
