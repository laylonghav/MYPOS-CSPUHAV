const { db, logError, isEmpty } = require("../util/helper");


exports.getlist = async (req, res) => {
  try {
    const {txtsearch} = req.query; // Extract the 'name' parameter from the query string
    let sql = "SELECT * FROM `order` ORDER BY id DESC";

    if (txtsearch) {
      sql =
        "SELECT * FROM `order` WHERE name LIKE :txtsearch ORDER BY id DESC";
    }

    const [data] = await db.query(sql, {
      txtsearch: `%${txtsearch}%`,
    });

    res.json({
      I_know_you_are_ID: req.current_id,
      list: data,
    });
  } catch (error) {
    logError("order.getlist", error, res);
  }
};


exports.create = async (req, res) => {
  try {
    var { order, order_product = [] } = req.body;
    order = {
      ...order,
      order_no: await newOrderNo(),
      user_id: req.auth?.id, // correct access
      create_by: req.auth.name, // correct access
    };
    // var sqlOrder =
    //   "INSERT INTO `order` (order_no, customer_id, total_amount, paid_amount, payment_method, remark, user_id, create_by) VALUES (:order_no, :customer_id, :total_amount, :paid_amount, :payment_method, :remark, :user_id, :create_by)";
    // var [data] = await db.query(sqlOrder, order);
    // order_product.map(async (item, index) => {
    //   "INSERT INTO order_detail (order_id, product_id, qty, price, discount, total) VALUES (:order_id, :product_id, :qty, :price, :discount, :total)";
    //   var [dataOrderProduct] = await db.query(sqlOrder, {
    //     ...item,
    //     order_id: data.insertId, // override key order_id
    //   });
    // });
    res.json({
      order: order,
      message: "Insert success!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    logError("order.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE `order` SET `name`=:name,`code`=:code,`tel`=:tel,`email`=:email,`address`=:address,`website`=:website,`note`=:note WHERE id=:id";
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
    logError("order.Delete", error, res);
  }
};
exports.remove = async (req, res) => {
  try {
    var sql = "DELETE FROM `order` WHERE id=:id";
    var param = {
      id: req.body.id,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Delete data successfully !",
    });
  } catch (error) {
    logError("order.Delete", error, res);
  }
};

const newOrderNo = async (req, res) => {
  try {
    var sql =
      "SELECT " +
      "CONCAT('ORD', LPAD((SELECT COALESCE(MAX(id), 0) + 1 FROM `order`), 5, '0'))" +
      " as order_no";
    var [data] = await db.query(sql);
    return data[0].order_no;
    // res.json({
    //   order_no: data[0].order_no,
    // });
  } catch (error) {
    logError("order.newOrderNo", error, res);
  }
};

