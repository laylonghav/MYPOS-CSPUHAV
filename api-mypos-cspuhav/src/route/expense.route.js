const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
  newRef_no,
} = require("../controller/expense.controller");

module.exports = (app) => {
  app.get("/api/expense", validate_token(), getlist);
  app.post("/api/expense", validate_token(), create);
   app.post("/api/newRef_no", newRef_no);
  app.put("/api/expense", update);
  app.delete("/api/expense", remove);
};
