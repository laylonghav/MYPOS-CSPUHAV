
const { db, logError } = require("../util/helper");
const bcrypt =require("bcrypt");

exports.regester = async(req, res) => {
  try {

    let password = req.body.password;
    password = bcrypt.hashSync(password,10);
    
    let sql =
      "INSERT INTO `user`(`role_id`, `name`, `username`, `password`, `is_active`, `create_by`) VALUES (:role_id, :name, :username, :password, :is_active, :create_by)";
      let data = await db.query(sql, {
        role_id: req.body.role_id,
        name: req.body.name,
        username: req.body.username,
        password: password,
        is_active: req.body.is_active,
        create_by: req.body.create_by,
      });
    res.json({
      data: data,
      message : "Register successfully !"
    });
  } catch (error) {
    logError("auth.regester", error, res);
  }
};
exports.login = async (req, res) => {
  try {
    let { password, username } = req.body;
    let sql = "SELECT * FROM `user` WHERE username=:username";
    let [data] = await db.query(sql, {
      username: username,
    });

    if (data.length === 0) {
      return res.json({
        error: {
          username: "Username doesn't exist!",
        },
      });
    } else {
      let dbpass = data[0].password;
      let iscurrectpass = bcrypt.compareSync(password, dbpass);
      if (!iscurrectpass) {
        return res.json({
          error: {
            password: "Password Incorrect!",
          },
        });
      } else {
        return res.json({
          message: "Login successfully!",
          profile: data,
        });
      }
    }
  } catch (error) {
    logError("auth.login", error, res);
  }
};

exports.profile = (req, res) => {
  try {
    res.json({
      list: [1],
    });
  } catch (error) {
    logError("auth.profile", error, res);
  }
};
