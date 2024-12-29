const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
} = require("../controller/expense_type.controller");

module.exports = (app) => {
  app.get(
    "/api/expense_type",
    validate_token("expanse_type.get_list"),
    getlist
  );
  app.post("/api/expense_type", validate_token("expanse_type.create"), create);
  app.put("/api/expense_type", validate_token("expanse_type.update"), update);
  app.delete(
    "/api/expense_type",
    validate_token("expanse_type.remove"),
    remove
  );
};
