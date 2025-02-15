const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
  create,
  update,
  remove,
  productImage,
  newbarcode,
} = require("../controller/product.controller");
const { uploadFile } = require("../util/helper");

module.exports = (app) => {
  app.get("/api/product", validate_token("product.get_list"), getlist);
  app.post(
    "/api/product",
    validate_token("product.create"),
    uploadFile.fields([
      { name: "upload_image", maxCount: 1 },
      { name: "upload_image_optional", maxCount: 4 },
    ]),
    create
  );
  app.put(
    "/api/product",
    validate_token("product.update"),
    uploadFile.fields([
      { name: "upload_image", maxCount: 1 },
      { name: "upload_image_optional", maxCount: 4 },
    ]),
    update
  );
  app.post("/api/new_barcode", newbarcode);
  app.delete("/api/product", validate_token("product.remove"), remove);
  app.get("/api/product_image/:product_id", productImage);
};
