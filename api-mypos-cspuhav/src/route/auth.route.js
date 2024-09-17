const {
  getlist,
  regester,
  login,
  profile,
  validate_token,
} = require("../controller/auth.controller"); ;

module.exports = (app) => {
  app.get("/api/auth/get-list", getlist);
  app.post("/api/auth/regester", regester);
  app.post("/api/auth/login", login);
  app.post("/api/auth/profile", validate_token(), profile);
};
