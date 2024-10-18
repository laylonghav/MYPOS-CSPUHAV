const { validate_token } = require("../controller/auth.controller");
const {
  getlist,
} = require("../controller/config.controller"); ;

module.exports = (app)=>{
    app.get("/api/config",  validate_token(),getlist); 
}