const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
  newRef_no,
} = require("../controller/expense.controller");

module.exports = (app) => {
  app.get("/api/expense", validate_token("expanse.get_list"), getlist);
  app.post("/api/expense", validate_token("expanse.create"), create);
  app.post("/api/newRef_no", newRef_no);
  app.put("/api/expense", validate_token("expanse.update"), update);
  app.delete("/api/expense", validate_token("expanse.remove"), remove);
};
