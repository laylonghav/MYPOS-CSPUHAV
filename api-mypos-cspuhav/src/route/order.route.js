const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  getone,
  create,
  update,
  remove,
} = require("../controller/order.controller");

module.exports = (app) => {
  app.get("/api/order", validate_token("order.get_list"), getlist);
  app.get("/api/order_detail/:id", validate_token(), getone);
  app.post("/api/order", validate_token(), create);
  app.put("/api/order", validate_token(), update);
  app.delete("/api/order", validate_token(), remove);
};
