const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    const [customer] = await db.query(
      "SELECT count(id) AS total FROM customer;"
    );
    const [employee] = await db.query(
      "SELECT count(id) AS total FROM employee;"
    );
    const [expense] = await db.query(
      "SELECT SUM(amount) AS total , count(id) AS total_expense FROM expense" +
        " WHERE" +
        " MONTH(create_at) = MONTH(CURRENT_DATE)" +
        " AND YEAR(create_at) = YEAR(CURRENT_DATE);"
    );
    const [sale] = await db.query(
      "SELECT" +
        " CONCAT(CONVERT(SUM(r.total_amount),CHAR),'$') total" +
        " ,count(r.id) total_order" +
        " FROM `order` r" +
        " WHERE" +
        " MONTH(r.create_at) = MONTH(CURRENT_DATE)" +
        " AND YEAR(r.create_at) = YEAR(CURRENT_DATE);"
    );
    const [sale_summary_by_months] = await db.query(
      "SELECT " +
        "DATE_FORMAT(r.create_at, '%M') AS title, " +
        "SUM(r.total_amount) AS total " +
        // "COUNT(r.id) AS total_order " +
        "FROM `order` r " +
        "WHERE YEAR(r.create_at) = YEAR(CURRENT_DATE) " +
        "GROUP BY MONTH(r.create_at)"
    );
    const [expense_summary_by_months] = await db.query(
      "SELECT " +
        "DATE_FORMAT(e.expense_date, '%M') AS title, " +
        "SUM(e.amount) AS total " +
        // "COUNT(r.id) AS total_order " +
        "FROM `expense` e " +
        "WHERE YEAR(e.expense_date) = YEAR(CURRENT_DATE) " +
        "GROUP BY MONTH(e.expense_date)"
    );

    let dashboard = [
      {
        title: "Customer",
        // total: customer[0].total,
        summary: {
          total: customer[0].total,
          Male: 10,
          Female: 21,
        },
      },
      {
        title: "Employee",
        // total: employee[0].total,
        summary: {
          total: employee[0].total,
          Male: 5,
          Female: 6,
        },
      },
      {
        title: "Expense",
        summary: {
          Expense: "This Month",
          total: `${expense[0].total || 0}$`, // Safely add the '$' and handle null
          total_expense: `${expense[0].total_expense || 0}`, // Safely add the '$' and handle null
        },
      },
      {
        title: "Sale",
        summary: {
          Sale: "This Month",
          total: `${sale[0].total || 0}$`,
          total_order: `${sale[0].total_order || 0}Order`,
        }, // Safely add the '$' and handle null
      },
    ];

    res.json({
      I_know_you_are_ID: req.current_id,
      customer: customer[0].total,
      dashboard,
      sale_summary_by_months,
      expense_summary_by_months,
    });
  } catch (error) {
    logError("dashboard.getlist", error, res);
  }
};

// SELECT
//     -- MONTH(r.create_at) month
//     DATE_FORMAT(r.create_at, '%M') month,
//     SUM(r.total_amount) total,
//     count(r.id) total_order
// FROM `order` r
// WHERE YEAR(r.create_at) = YEAR(CURRENT_DATE)
// GROUP BY MONTH(r.create_at);
