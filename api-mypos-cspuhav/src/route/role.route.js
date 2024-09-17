const { validate_token } = require("../controller/auth.controller");
const {getlist,create,update,remove} =require("../controller/role.controller") ;

module.exports = (app)=>{
    app.get("/api/role",  validate_token(),getlist);
    app.post("/api/role", validate_token(), create);
    app.put("/api/role",update);
    app.delete("/api/role",remove);
}