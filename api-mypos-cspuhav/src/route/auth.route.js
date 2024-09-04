const {
  regester,
  login,
  profile,
} = require("../controller/auth.controller"); ;

module.exports = (app) => {
  app.post("/api/auth/regester", regester);
  app.post("/api/auth/login", login);
  app.get("/api/auth/profile", profile);
};
