const { db, logError } = require("../util/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../util/config");

exports.getlist = async (req, res) => {
  try {
    // let { password, username } = req.body;
    // let sql = "SELECT * FROM `user` WHERE username=:username";
    let sql =
      "SELECT " +
      " u.id," +
      " u.name," +
      " u.username," +
      " u.is_active," +
      " u.create_by," +
      " r.name as role_name" +
      " FROM user u " +
      " INNER JOIN role r ON u.role_id = r.id ";
    let [data] = await db.query(sql);
    const [role] = await db.query(
      "SELECT `id` as value, `Name` as label FROM `role`;"
    );

    return res.json({
      data: data,
      data_role: role,
    });
  } catch (error) {
    logError("auth.getlist", error, res);
  }
};

exports.regester = async (req, res) => {
  try {
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10);

    let sql =
      "INSERT INTO `user`(`role_id`, `name`, `username`, `password`, `is_active`, `create_by`) VALUES (:role_id, :name, :username, :password, :is_active, :create_by)";
    let data = await db.query(sql, {
      role_id: req.body.role_id,
      name: req.body.name,
      username: req.body.username,
      password: password,
      is_active: req.body.is_active,
      create_by: req.auth?.name, // get current user that action this module
    });
    res.json({
      data: data,
      message: "Register successfully !",
    });
  } catch (error) {
    logError("auth.regester", error, res);
  }
};
exports.login = async (req, res) => {
  try {
    let { password, username } = req.body;
    // let sql = "SELECT * FROM `user` WHERE username=:username";
    let sql =
      "SELECT " +
      " u.*," +
      " r.name as role_name" +
      " FROM user u " +
      " INNER JOIN role r ON u.role_id = r.id " +
      " WHERE u.username=:username ";
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
        delete data[0].password;
        let obj = {
          profile: data[0],
          permision: ["view_all", "delete", "edit"],
        };
        return res.json({
          message: "Login success",
          ...obj,
          access_token: await getAccessToken(obj),
        });
      }
    }
  } catch (error) {
    logError("auth.login", error, res);
  }
};

exports.profile = async (req, res) => {
  try {
    res.json({
      profile: req.profile,
    });
    // let sql = "SELECT * FROM `user` WHERE id=:id";
    // let [data] = await db.query(sql, {
    //   id: req.body.id,
    // });
    // res.json({
    //   list: data.length > 0 ? data[0] : null,
    // });
  } catch (error) {
    logError("auth.profile", error, res);
  }
};

exports.validate_token = () => {
  // call in midleware in route (role route, user route, teacher route)
  return (req, res, next) => {
    var authorization = req.headers.authorization; // token from client
    var token_from_client = null;
    if (authorization != null && authorization != "") {
      token_from_client = authorization.split(" "); // authorization : "Bearer lkjsljrl;kjsiejr;lqjl;ksjdfakljs;ljl;r"
      token_from_client = token_from_client[1]; // get only access_token
    }
    if (token_from_client == null) {
      res.status(401).send({
        message: "Unauthorized",
      });
    } else {
      jwt.verify(
        token_from_client,
        config.config.token.access_token_key,
        (error, result) => {
          if (error) {
            res.status(401).send({
              message: "Unauthorized",
              error: error,
            });
          } else {
            req.current_id = result.data.profile.id;
            req.auth = result.data.profile; // write user property
            req.permision = result.data.permision; // write user property
            next(); // continue controller
          }
        }
      );
    }
  };
};

// const getAccessToken = async () => {
//   // const keyToken = "2142tegfgdfg645646";
//   const data = {
//     id: 1,
//     name: "Sok",
//   };
//   const Access_token = await jwt.sign(
//     { data },
//     config.config.token.access_token_key,
//     {
//       expiresIn: "180s",
//     }
//   );
//   return Access_token;
// };

const getAccessToken = async (paramData) => {
  const acess_token = await jwt.sign(
    { data: paramData },
    config.config.token.access_token_key,
    {
      expiresIn: "1d", //"180s",
    }
  );
  return acess_token;
};
