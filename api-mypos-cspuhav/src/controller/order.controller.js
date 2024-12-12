const { db, logError, isEmpty } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const { txtsearch, page, is_list_all, customer, from_date, to_date } =
      req.query;
    const pageSize = 10;
    const currentPage = Number(page) || 1; // Default to page 1 if not provided or invalid
    const offset = (currentPage - 1) * pageSize;

    // SQL Select and Join Parts
    const sqlselect =
      "SELECT o.*, c.name AS customer_name, c.tel AS customer_tel, c.address AS customer_address ";
    const sqljoin =
      " FROM `order` o LEFT JOIN customer c ON o.customer_id = c.id ";

    // SQL Where Clause Construction
    let sqlwhere = " WHERE 1=1 ";
    const sqlParams = {};

    if (txtsearch) {
      sqlwhere +=
        " AND (o.order_no LIKE :txtsearch OR c.name LIKE :txtsearch OR c.tel LIKE :txtsearch) ";
      sqlParams.txtsearch = `%${txtsearch}%`;
    }

    if (customer) {
      sqlwhere += " AND o.customer_id = :customer ";
      sqlParams.customer = customer;
    }

    //  if (!isEmpty(from_date) && !isEmpty(to_date)) {
    //    sqlwhere += " AND o.create_at BETWEEN :from_date AND :to_date ";
    //    sqlParams.from_date = from_date;
    //    sqlParams.to_date = to_date;
    //  }

    if (!isEmpty(from_date) && !isEmpty(to_date)) {
      // sqlWhere +=
      // " AND DATE_FORMAT(o.create_at,'%Y-%m-%d') >= '2024-11-27' "
      // " AND DATE_FORMAT(o.create_at,'%Y-%m-%d') <= '2024-11-27' ";
      sqlwhere +=
        " AND DATE_FORMAT(o.create_at,'%Y-%m-%d') BETWEEN :from_date AND :to_date ";
      sqlParams.from_date = from_date;
      sqlParams.to_date = to_date;
    }
    var sqlOrder = " ORDER BY o.id DESC ";

    // Adding Limit and Offset
    const sqlLimit = is_list_all ? "" : ` LIMIT ${pageSize} OFFSET ${offset}`;

    // Final Query
    var sqlOrder = " ORDER BY o.id DESC ";

    const sql = sqlselect + sqljoin + sqlwhere + sqlOrder + sqlLimit;
    const [list] = await db.query(sql, sqlParams);

    let dataCount = 0;
    let totalAmount = 0;
    let dataCountAll = 0;
    let totalAmountAll = 0;

    if (currentPage === 1 || is_list_all) {
      // SQL for Counting Total Rows and Amount
      const sqlTotal =
        "SELECT COUNT(o.id) AS total, SUM(IFNULL(o.total_amount, 0)) AS total_amount " +
        sqljoin +
        sqlwhere;

      const [totalData] = await db.query(sqlTotal, sqlParams);
      dataCount = totalData[0]?.total || 0;
      totalAmount = totalData[0]?.total_amount || 0;
    }

    const totalall =
      "SELECT COUNT(o.id) AS total, SUM(IFNULL(o.total_amount, 0)) AS total_amount" +
      sqljoin;
    const [totalDataAll] = await db.query(totalall, sqlParams);
    dataCountAll = totalDataAll[0]?.total || 0;
    totalAmountAll = totalDataAll[0]?.total_amount || 0;

    const totalPages = Math.ceil(dataCount / pageSize);

    // Sending Response
    res.json({
      list,
      total: dataCount,
      totalAmount,
      totalAmountAll,
      dataCountAll,
      page: currentPage,
      pageSize,
      totalPages,
    });
  } catch (error) {
    logError("order.getList", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    var { order, order_detail = [] } = req.body;
    order = {
      ...order,
      order_no: await newOrderNo(),
      user_id: req.auth?.id, // correct access
      create_by: req.auth.name, // correct access
    };

    // Insert the order into the 'order' table
    var sqlOrder =
      "INSERT INTO `order` (order_no, customer_id, total_amount, paid_amount, payment_method, remark, user_id, create_by) VALUES (:order_no, :customer_id, :total_amount, :paid_amount, :payment_method, :remark, :user_id, :create_by)";

    var [data] = await db.query(sqlOrder, order);

    // Loop through the order products and insert them into 'order_detail'
    await Promise.all(
      order_detail.map(async (item) => {
        const sqlOrderDetail =
          "INSERT INTO order_detail (order_id, product_id, qty, price, discount, total) VALUES (:order_id, :product_id, :qty, :price, :discount, :total)";
        await db.query(sqlOrderDetail, {
          ...item,
          order_id: data.insertId, // override key order_id
        });

        // Update the product quantity in the 'product' table
        const sqlUpdateProduct =
          "UPDATE product SET qty = qty - :qty WHERE id = :product_id";
        await db.query(sqlUpdateProduct, {
          qty: item.qty,
          product_id: item.product_id,
        });
      })
    );
    const [currentOrder] = await db.query(
      "select * from `order` where id=:id",
      {
        id: data.insertId,
      }
    );
    const [currentCustomer] = await db.query(
      "SELECT * FROM `customer` WHERE id=:id",
      {
        id: order.customer_id, // Ensure `customer_id` comes from the order data
      }
    );

    res.json({
      order: currentOrder.length > 0 ? currentOrder[0] : null,
      customer: currentCustomer.length > 0 ? currentCustomer[0] : null,
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
      "UPDATE `order` SET `order_no`= :order_no,`customer_id`= :customer_id,`user_id`= :user_id,`total_amount`= :total_amount,`paid_amount`= :paid_amount,`payment_method`= :payment_method,`remark`= :remark WHERE id=:id";
    var param = {
      id: req.body.id,
      order_no: req.body.order_no,
      customer_id: req.body.customer_id,
      user_id: req.body.user_id,
      total_amount: req.body.total_amount,
      paid_amount: req.body.paid_amount,
      payment_method: req.body.payment_method,
      remark: req.body.remark,
    };

    const [data] = await db.query(sql, param);
    res.json({
      data: data,
      message: "Update data successfully !",
    });
  } catch (error) {
    logError("order.Update", error, res);
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
exports.getone = async (req, res) => {
  try {
    var sql =
      "select " +
      " od.*, " +
      " p.name p_name, " +
      " p.brand p_brand, " +
      " p.description p_des, " +
      " p.image p_image, " +
      " c.name p_category_name " +
      " from order_detail od " +
      " inner join product p on od.product_id = p.id " +
      " inner join category c on p.category_id = c.id " +
      " where od.order_id = :id";
    const [list] = await db.query(sql, { id: req.params.id });
    res.json({
      list: list,
      message: "Get data by one id successfully !",
    });
  } catch (error) {
    logError("order.getOne", error, res);
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
