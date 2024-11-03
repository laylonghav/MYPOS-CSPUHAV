const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
  newRef,
} = require("../controller/purchase.controller");

module.exports = (app) => {
  app.get("/api/purchase", validate_token(), getlist);
  app.post("/api/purchase", validate_token(), create);
  app.post("/api/newref", newRef);
  app.put("/api/purchase", update);
  app.delete("/api/purchase", remove);
};
