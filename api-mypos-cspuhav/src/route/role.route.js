const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
} = require("../controller/role.controller");

module.exports = (app) => {
  app.get("/api/role", validate_token("role.get_list"), getlist);
  app.post("/api/role", validate_token("role.create"), create);
  app.put("/api/role", update);
  app.delete("/api/role", remove);
};
