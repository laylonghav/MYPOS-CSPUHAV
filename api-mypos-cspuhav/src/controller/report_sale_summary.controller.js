const { db, logError } = require("../util/helper");

exports.report_sale_summary = async (req, res) => {
  try {
    let { from_date, to_date, category_id, brand } = req.query;
    // let from_date = "2024-11-01";
    // let to_date = "2024-11-30";
    let sql =
      "SELECT DATE_FORMAT(o.create_at,'%d/%m/%Y') title," +
      " sum(od.total_qty) total_qty," +
      " sum(od.total_amount) total_amount" +
      " from `order` o" +
      " inner join" +
      " (" +
      " select" +
      " od1.order_id," +
      " sum(od1.qty) total_qty," +
      " sum(od1.total) total_amount" +
      " from order_detail od1" +
      " inner join product p on od1.product_id = p.id " +
      " where (:category_id IS NULL OR p.category_id = :category_id)" +
      " and (:brand IS NULL OR p.brand = :brand)" +
      " group by od1.order_id" +
      " ) od on o.id = od.order_id" +
      " where DATE_FORMAT(o.create_at, '%Y-%m-%d') BETWEEN :from_date and :to_date" +
      " group by DATE_FORMAT(o.create_at, '%d/%m/%Y')";
    const [list] = await db.query(sql, {
      from_date,
      to_date,
      category_id,
      brand,
    });

    res.json({
      list: list,
    });
  } catch (error) {
    logError("report_sale_summary.getlist", error, res);
  }
};
exports.report_expense_summary = async (req, res) => {
  try {
    let { from_date, to_date, expense_type_id } = req.query;

    // let sql =
    //   "select" +
    //   " DATE_FORMAT(e.expense_date, '%d/%m/%Y') title," +
    //   " sum(e.amount) total_amount" +
    //   " from expense e " +
    //   " where DATE_FORMAT(e.expense_date, '%Y-%m-%d') between :from_date and :to_date " +
    //   " and (:expense_type_id is null or e.expense_type_id = :expense_type_id) " +
    //   " group by e.expense_date ";

    let sql =
      "select" +
      " DATE_FORMAT(e.expense_date, '%d/%m/%Y') title," +
      " sum(e.amount) total_amount," +
      " GROUP_CONCAT(et.name SEPARATOR ', ') expense_type_name" + // Include the expense type name
      " from expense e " +
      " left join expense_type et on e.expense_type_id = et.id " + // Join with the expense_type table
      " where DATE_FORMAT(e.expense_date, '%Y-%m-%d') between :from_date and :to_date " +
      " and (:expense_type_id is null or e.expense_type_id = :expense_type_id) " +
      " group by e.expense_date "; // Group by expense_date and expense_type name

    const [list] = await db.query(sql, { from_date, to_date, expense_type_id });
    // console.log(list);

    res.json({
      list: list,
    });
  } catch (error) {
    logError("report_expense_summary.getlist", error, res);
  }
};
exports.report_new__customer_summary = async (req, res) => {
  try {
    let { from_date, to_date, name } = req.query;

    let sql =
      "SELECT" +
      " DATE_FORMAT(c.create_at, '%d/%m/%Y') AS title," +
      " COUNT(c.id) AS total_amount , GROUP_CONCAT(c.name SEPARATOR ', ') AS name" + // Sum of COUNT(c.id)
      " FROM customer c " +
      " WHERE (:name IS NULL OR c.name = :name) " +
      " AND DATE_FORMAT(c.create_at, '%Y-%m-%d') BETWEEN :from_date AND :to_date " +
      " GROUP BY DATE_FORMAT(c.create_at, '%Y-%m-%d')";

    const [list] = await db.query(sql, { from_date, to_date, name });

    res.json({
      list: list,
    });
  } catch (error) {
    logError("report_new__customer_summary.getlist", error, res);
  }
};

// exports.report_sale_top_item = async (req, res) => {
//   try {
//     const { from_date, to_date } = req.body; // Assuming dates are sent in the body of the request

//     let sql =
//       "SELECT" +
//       " p.id AS product_id," +
//       " p.name AS product_name," +
//       " p.image AS product_image," +
//       " SUM(od.qty * od.price) AS total_sales_amount" +
//       " FROM" +
//       " product p" +
//       " JOIN" +
//       " order_detail od ON p.id = od.product_id" +
//       " WHERE" +
//       " DATE_FORMAT(od.create_at, '%Y-%m-%d') BETWEEN :from_date AND :to_date" + // Add the date filter condition
//       " GROUP BY" +
//       " p.id, p.name, p.image" +
//       " ORDER BY" +
//       " total_sales_amount DESC" +
//       " LIMIT 10;";

      
//       // Pass the dates to the query
//       const [list] = await db.query(sql, { from_date, to_date });
      
//       console.log(list)
//     res.json({
//       list: list,
//     });
//   } catch (error) {
//     logError("report_sale_top_item.getlist", error, res);
//   }
// };


exports.report_sale_top_item = async (req, res) => {
  try {
    const { from_date, to_date } = req.query; // Assuming dates are sent in the body of the request

    let sql =
      "SELECT" +
      " p.id AS product_id," +
      " p.name AS product_name," +
      " p.image AS product_image," +
      " SUM(od.qty * od.price) AS total_sales_amount" +
      " FROM" +
      " product p" +
      " JOIN" +
      " order_detail od ON p.id = od.product_id" +
      " WHERE" +
      " DATE_FORMAT(od.create_at, '%Y-%m-%d') BETWEEN :from_date AND :to_date " + // Use ? placeholder for parameterized query
      " GROUP BY" +
      " p.id, p.name, p.image" +
      " ORDER BY" +
      " total_sales_amount DESC" +
      " LIMIT 10;";

    // Pass the dates as an array of values to the query
    const [list] = await db.query(sql, {from_date, to_date});

    console.log(list); // Optional for debugging
    res.json({
      list: list,
    });
  } catch (error) {
    logError("report_sale_top_item.getlist", error, res);
  }
};
