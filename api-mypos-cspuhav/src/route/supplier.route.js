const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
} = require("../controller/supplier.controller");

module.exports = (app) => {
  app.get("/api/supplier", validate_token("supplier.get_list"), getlist);
  app.post("/api/supplier", validate_token("supplier.create"), create);
  app.put("/api/supplier", validate_token("supplier.update"), update);
  app.delete("/api/supplier", validate_token("supplier.remove"), remove);
};
