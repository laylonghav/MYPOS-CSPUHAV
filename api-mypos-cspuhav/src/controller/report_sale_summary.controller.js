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
  
     
    const [list] = await db.query(sql, {
     
    });

    res.json({
      list: list,
    });
  } catch (error) {
    logError("report_expense_summary.getlist", error, res);
  }
};
