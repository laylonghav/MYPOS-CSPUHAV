const { validate_token } = require("../controller/auth.controller");
const {getlist,create,update,remove} =require("../controller/product.controller") ;
const { uploadFile } = require("../util/helper");

module.exports = (app)=>{
    app.get("/api/product",  validate_token(),uploadFile.single("upload_image"),getlist);
    app.post(
      "/api/product",
      validate_token(),
      uploadFile.single("upload_image"),
      create
    );
    app.put("/api/product",update);
    app.delete("/api/product",remove);
}