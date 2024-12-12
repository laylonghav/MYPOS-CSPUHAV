const { validate_token } = require("../controller/auth.controller");
const { getlist } = require("../controller/dashboard.controller"); ;

module.exports = (app)=>{
    app.get("/api/dashboard",  validate_token(),getlist); 
}