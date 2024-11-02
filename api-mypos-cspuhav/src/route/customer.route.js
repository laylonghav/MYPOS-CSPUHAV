const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
} = require("../controller/customer.controller");

module.exports = (app) => {
  app.get("/api/customer", validate_token(), getlist);
  app.post("/api/customer", validate_token(), create);
  app.put("/api/customer", update);
  app.delete("/api/customer", remove);
};
