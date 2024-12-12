const { validate_token } = require("../controller/auth.controller");
const report = require("../controller/report_sale_summary.controller"); ;

module.exports = (app)=>{
    app.get(
      "/api/report_sale_summary",
      validate_token(),
      report.report_sale_summary
    );
    app.get(
      "/api/report_expense_summary",
      validate_token(),
      report.report_expense_summary
    );
    app.get(
      "/api/report_expense_summary",
      validate_token(),
      report.report_sale_summary
    );
    app.get(
      "/api/report_sale_top_item",
      validate_token(),
      report.report_sale_summary
    );
}