const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
} = require("../controller/customer.controller");

module.exports = (app) => {
  app.get("/api/customer", validate_token("customer.get_list"), getlist);
  app.post("/api/customer", validate_token("customer.create"), create);
  app.put("/api/customer", validate_token("customer.update"), update);
  app.delete("/api/customer", validate_token("customer.remove"), remove);
};
