const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
} = require("../controller/purchase_product.controller");

module.exports = (app) => {
  app.get("/api/purchase_product", validate_token(), getlist);
  app.post("/api/purchase_product", validate_token(), create);
  app.put("/api/purchase_product", update);
  app.delete("/api/purchase_product", remove);
};
