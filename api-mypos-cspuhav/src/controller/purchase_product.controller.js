const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const { txtsearch, status } = req.query;

    // Base SQL query
    let sql = `
      SELECT pp.*, 
             pc.ref AS purchase_name,
             pr.name AS product_name
      FROM purchase_product pp
      INNER JOIN purchase pc 
        ON pp.purchase_id = pc.id
      JOIN product pr
        ON pp.product_id = pr.id
      WHERE 1
    `;

    // Parameters for the SQL query
    const queryParams = {};

    // Search condition
    if (txtsearch) {
      sql += `
        AND (pc.ref LIKE :txtsearch OR pr.name LIKE :txtsearch)
      `;
      queryParams.txtsearch = `%${txtsearch}%`;
    }

    // Status condition
    if (status) {
      sql += " AND pp.status = :status";
      queryParams.status = status;
    }

    // Add ORDER BY clause to sort results by ID in descending order
    sql += " ORDER BY pp.id DESC";

    // Execute the query
    const [data] = await db.query(
      {
        sql,
        namedPlaceholders: true,
      },
      queryParams
    );

    // Return the data in response
    res.json({
      list: data,
    });
  } catch (error) {
    logError("purchase_product.getlist", error, res);
  }
};



exports.create = async (req, res) => {
  try {
    const sql =
      "INSERT INTO `purchase_product`( `purchase_id`, `product_id`, `qty`, `cost`, `discount`, `amount`, `retail_price`, `remark`, `status`, `create_by` ) VALUES  " +
      "(:purchase_id, :product_id, :qty, :cost,:discount, :amount, :retail_price,:remark, :status, :create_by)";

    const param = {
      purchase_id: req.body.purchase_id,
      product_id: req.body.product_id,
      qty: req.body.qty,
      cost: req.body.cost,
      discount: req.body.discount,
      amount: req.body.amount,
      retail_price: req.body.retail_price,
      remark: req.body.remark,
      status: req.body.status,
      create_by: req.auth?.name,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Data inserted successfully!",
    });
  } catch (error) {
    logError("purchase_product.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    const sql =
      "UPDATE `purchase_product` SET `purchase_id`= :purchase_id ,`product_id`= :product_id ,`qty`= :qty ,`cost`= :cost ,`discount`= :discount ,`amount`= :amount ,`retail_price`= :retail_price ,`remark`= :remark ,`status`= :status " +
      "WHERE `id` = :id";

    const param = {
      id: req.body.id,
      purchase_id: req.body.purchase_id,
      product_id: req.body.product_id,
      qty: req.body.qty,
      cost: req.body.cost,
      discount: req.body.discount,
      amount: req.body.amount,
      retail_price: req.body.retail_price,
      remark: req.body.remark,
      status: req.body.status,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Data updated successfully!",
    });
  } catch (error) {
    logError("purchase_product.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    const sql = "DELETE FROM `purchase_product` WHERE id = :id";
    const param = { id: req.body.id };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Data deleted successfully!",
    });
  } catch (error) {
    logError("purchase_product.remove", error, res);
  }
};

