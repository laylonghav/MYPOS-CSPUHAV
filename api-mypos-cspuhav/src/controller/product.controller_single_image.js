const {
  db,
  isArray,
  isEmpty,
  logError,
  removeFile,
} = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    // Destructuring req.body to get the parameters
    const { txtsearch, category_id, brand } = req.query; // Extract fields from req.body

    // console.log("body: ", req.body); // Log request body
    // console.log("query: ", req.query); // Log query parameters (for GET requests)

    // res.json({
    //   body: req.body, // Return the body as part of the response
    //   query: req.query, // Return the query as part of the response
    // });

    // return; // Ensure the function returns after sending the response
    // Creating an SQL query with proper spaces between sections

    // query:  { txtsearch: 'a', category_id: 'a', brand: 'a' }

    var sql = `
      SELECT p.*, 
             c.name AS category_name
      FROM product p
      INNER JOIN category c 
        ON p.category_id = c.id
      WHERE 1 
    `;

    // Adding conditions dynamically based on the parameters received

    if (category_id) {
      sql += " AND p.category_id = :category_id";
    }
    if (txtsearch) {
      sql += " AND p.name LIKE :txtsearch OR p.barcode = :barcode";
    }
    if (brand) {
      sql += " AND p.brand = :brand";
    }

    // Executing the query with the parameters
    const [list] = await db.query(sql, {
      txtsearch: "%" + txtsearch + "%",
      category_id: category_id,
      barcode: txtsearch,
      brand: brand,
    });

    // Sending the response
    res.json({
      i_know_you_are_id: req.current_id,
      list: list,
    });
  } catch (error) {
    logError("category.getList", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    if (await isExistBarcode(req.barcode)) {
      res.json({
        error: {
          barcode: "Barcode already exist.",
        },
      });
      return false;
    }
    var sql =
      " INSERT INTO product (category_id, barcode,name,brand,description,qty,price,discount,status,image,create_by ) " +
      " VALUES (:category_id, :barcode, :name, :brand, :description, :qty, :price, :discount, :status, :image, :create_by ) ";
    var [data] = await db.query(sql, {
      ...req.body,
      image: req.file?.filename,
      create_by: req.auth?.name,
    });
    res.json({
      data,
      message: "Insert success!",
    });
  } catch (error) {
    logError("category.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    // Corrected SQL query
    var sql =
      "UPDATE `product` SET `category_id`=:category_id, `barcode`=:barcode, `name`=:name," +
      "`brand`=:brand, `description`=:description, `qty`=:qty, `price`=:price," +
      "`discount`=:discount, `status`=:status, `image`=:image " + // Removed extra single quote
      "WHERE id = :id";

    let filename = req.body.image; // Default to existing image

    // Image new upload
    if (!filename && req.file) {
      filename = req.file?.filename;
    }

    // Image change
    if (req.body.image && req.file) {
      // Await the removal of the old file
      await removeFile(req.body.image).catch((err) => {
        console.error("Error removing old image:", err);
      });
      filename = req.file?.filename;
    }

    // Image remove
    if (req.body.image_remove === "1") {
      // Await the removal of the image
      await removeFile(req.body.image).catch((err) => {
        console.error("Error removing image:", err);
      });
      filename = null;
    }

    // Execute the SQL query
    const [data] = await db.query(sql, {
      ...req.body,
      image: filename,
      create_by: req.auth?.name,
    });

    res.json({
      data: data,
      message: "Data update success!",
    });
  } catch (error) {
    logError("update.create", error, res);
  }
};


exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM product WHERE id = :id", {
      id: req.body.id, // null
    });
    if (data.affectedRows && req.body.image != "" && req.body.image != null) {
      removeFile(req.body.image);
    }
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("remove.create", error, res);
  }
};

exports.newbarcode = async (req, res) => {
  try {
    var sql =
      "SELECT " +
      "CONCAT('P',LPAD((SELECT COALESCE(MAX(id),0) + 1 FROM product), 3, '0')) " +
      "as barcode";
    var [data] = await db.query(sql);
    res.json({
      barcode: data[0].barcode,
    });
  } catch (error) {
    logError("remove.create", error, res);
  }
};

isExistBarcode = async (barcode) => {
  try {
    var sql = "SELECT COUNT(id) as Total FROM product WHERE barcode=:barcode";
    var [data] = await db.query(sql, {
      barcode: barcode,
    });
    if (data.length > 0 && data[0].Total > 0) {
      return true; // ស្ទួន
    }
    return false; // អត់ស្ទួនទេ
  } catch (error) {
    logError("isExistBarcode.check", error, res);
  }
};
