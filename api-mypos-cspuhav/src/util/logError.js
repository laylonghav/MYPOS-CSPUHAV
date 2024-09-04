const { body, validationResult } = require("express-validator");

const fs = require("fs/promises");
const moment = require("moment");

exports.logError = async (controller, message_error, res) => {
  try {
    const timestamp = moment().format("DD/MM/YYYY HH:mm:ss"); // Use 'moment' for formatted timestamp
    const path = "./logs/" + controller + ".txt";
    const logMessage = "[" + timestamp + "] " + message_error + "\n";
    await fs.appendFile(path, logMessage);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
  res.status(500).send("Internal Server Error!");
};

exports.validatecheck = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    errors: errors.array(),
  });
};

// module.exports = {
//   logError,
//   validatecheck,
// };

// > npm install moment
// creat new folde logs in root project
