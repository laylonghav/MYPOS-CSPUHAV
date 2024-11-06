const {
  db,
  isArray,
  isEmpty,
  logError,
  removeFile,
} = require("../util/helper");


exports.getlist = async (req, res) => {
  try {
    var { txt_search, category_id, brand, page } = req.query;
    const pageSize = 5; // fix
    page = Number(page); // 1,2,3,4 from client
    const offset = (page - 1) * pageSize; // find
    var sqlSelect = `SELECT p.*, 
             c.name AS category_name,
             pi.image AS product_image,
             pi.id AS product_image_id `;
    var sqlJoin = `FROM product p
      INNER JOIN category c 
        ON p.category_id = c.id
      LEFT JOIN product_image pi
        ON pi.product_id = p.id `;
    var sqlWhere = "WHERE true ";
    if (txt_search) {
      sqlWhere += " AND (p.name LIKE :txt_search OR p.barcode = :barcode) ";
    }
    if (category_id) {
      sqlWhere += " AND p.category_id = :category_id";
    }
    if (brand) {
      sqlWhere += " AND p.brand = :brand";
    }
    var sqlLimit = " LIMIT " + pageSize + " OFFSET " + offset;
    var sqlList = sqlSelect + sqlJoin + sqlWhere + sqlLimit;
    var sqlparam = {
      txt_search: "%" + txt_search + "%",
      barcode: txt_search,
      category_id,
      brand,
    };
    const [list] = await db.query(sqlList, sqlparam);
    var dataCount = 0;
    if (page == 1) {
      let sqlTotal = "SELECT COUNT(p.id) as total " + sqlJoin + sqlWhere;
      var [dataCount] = await db.query(sqlTotal, sqlparam);
      dataCount = dataCount[0].total;
    }
    // console.log(list)
    res.json({
      list: list,
      total: dataCount,
    });
  } catch (error) {
    logError("product.getList", error, res);
  }
};

exports.create = async (req, res) => {
  try {
    const barcodeExists = await isExistBarcode(req.body.barcode);
    if (barcodeExists) {
      res.json({ error: { barcode: "Barcode already exists." } });
      return;
    }

    const sql = `
      INSERT INTO product (category_id, barcode, name, brand, description, qty, price, discount, status, image, create_by)
      VALUES (:category_id, :barcode, :name, :brand, :description, :qty, :price, :discount, :status, :image, :create_by)`;
    const [data] = await db.query(sql, {
      ...req.body,
      image: req.files?.upload_image[0].filename,
      create_by: req.auth?.name,
    });

    // If there's an additional image for `product_image` table
    if (req.files?.upload_image_optional) {
      const paramImageProduct = req.files.upload_image_optional.map((item) => [
        data.insertId,
        item.filename,
      ]);
      const sqlImageProduct =
        "INSERT INTO product_image (product_id, image) VALUES ?";
      await db.query(sqlImageProduct, [paramImageProduct]);
    }

    res.json({
      data,
      message: "Insert success!",
    });
  } catch (error) {
    logError("product.create", error, res);
  }
};

// exports.update = async (req, res) => {
//   try {
//     // Corrected SQL query
//     const sql =
//       "UPDATE `product` SET `category_id` = :category_id, `barcode` = :barcode, `name` = :name," +
//       "`brand` = :brand, `description` = :description, `qty` = :qty, `price` = :price," +
//       "`discount` = :discount, `status` = :status, `image` = :image " +
//       "WHERE id = :id";

//     let filename = req.body.image; // Default to existing image

//     // Image new upload
//     if (!filename && req.files?.upload_image) {
//       filename = req.files.upload_image[0].filename;
//     }

//     // Image change
//     if (req.body.image && req.files?.upload_image) {
//       // Await the removal of the old file
//       await removeFile(req.body.image).catch((err) => {
//         console.error("Error removing old image:", err);
//       });
//       filename = req.files.upload_image[0].filename;
//     }

//     // Image remove
//     if (req.body.image_remove === "1") {
//       // Await the removal of the image
//       await removeFile(req.body.image).catch((err) => {
//         console.error("Error removing image:", err);
//       });
//       filename = null;
//     }

//     // Execute the SQL query
//     const [data] = await db.query(sql, {
//       ...req.body,
//       image: filename,
//       create_by: req.auth?.name,
//     });

//     // Handling optional uploads
//     if (req.files?.upload_image_optional) {
//       const productId = req.body.id; // Use the ID from request body

//       for (const item of req.files.upload_image_optional) {
//         const imageFilename = item.filename;

//         // Check if the image already exists in the database
//         const [existingImage] = await db.query(
//           "SELECT id, image FROM product_image WHERE product_id = :productId AND image = :image",
//           { productId, image: imageFilename }
//         );

//         if (existingImage.length > 0) {
//           // Remove the old file if it’s being replaced
//           await removeFile(existingImage[0].image).catch((err) => {
//             console.error("Error removing existing image:", err);
//           });

//           // Update the existing image record
//           await db.query(
//             "UPDATE product_image SET image = :image WHERE id = :id",
//             { id: existingImage[0].id, image: imageFilename }
//           );
//         } else {
//           // Insert a new image record if it doesn't exist
//           await db.query(
//             "INSERT INTO product_image (product_id, image) VALUES (:productId, :image)",
//             { productId, image: imageFilename }
//           );
//         }
//       }
//     }

//     // Handle specific product image deletions
//     if (req.body.remove_image_optional) {
//       await db.query(
//         "DELETE FROM product_image WHERE product_id = :productId AND image = :image",
//         { productId: req.body.id, image: req.body.remove_image_optional }
//       );
//       await removeFile(req.body.remove_image_optional).catch((err) =>
//         console.error("Error removing product image file:", err)
//       );
//     }

//     res.json({
//       data: data,
//       message: "Data update success!",
//     });
//   } catch (error) {
//     logError("update.create", error, res);
//     res.status(500).json({ message: "An error occurred during the update." });
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     // SQL query for updating product details
//     const sql = `
//       UPDATE product SET
//       category_id = :category_id,
//       barcode = :barcode,
//       name = :name,
//       brand = :brand,
//       description = :description,
//       qty = :qty,
//       price = :price,
//       discount = :discount,
//       status = :status,
//       image = :image
//       WHERE id = :id;`;

//     let filename = req.body.image; // Default to the existing image from the body

//     // Handle new image upload
//     if (req.files && req.files?.upload_image && req.files?.upload_image[0]) {
//       filename = req.files?.upload_image[0].filename;

//       // Remove old image if it exists
//       if (req.body.image) {
//         await removeFile(req.body.image).catch((err) => {
//           console.error("Error removing old image:", err);
//         });
//       }
//     }

//     // Handle image removal request
//     if (req.body.image_remove === "1" && req.body.image) {
//       await removeFile(req.body.image).catch((err) => {
//         console.error("Error removing image:", err);
//       });
//       filename = null; // Set to null if the image is removed
//     }

//     // Execute the SQL query to update product
//     const [data] = await db.query(sql, {
//       ...req.body,
//       image: filename, // Use updated filename value
//       create_by: req.auth?.name,
//     });

//     // Check if the update affected any rows
//     if (data.affectedRows === 0) {
//       return res.status(404).json({ message: "Product not found." });
//     }

//     // Handle additional images for product_image table
//     if (req.files?.upload_image_optional) {
//       const productId = req.body.id; // Use the ID from request body

//       for (const item of req.files?.upload_image_optional) {
//         const imageFilename = item.filename;

//         // Check if the image already exists in the database
//         const [existingImage] = await db.query(
//           "SELECT id, image FROM product_image WHERE product_id = :productId AND image = :image",
//           { productId, image: imageFilename }
//         );

//         if (existingImage.length > 0) {
//           // Remove the old file if it’s being replaced
//           await removeFile(existingImage[0].image).catch((err) => {
//             console.error("Error removing existing image:", err);
//           });

//           // Update the existing image record
//           await db.query(
//             "UPDATE product_image SET image = :image WHERE id = :id",
//             { id: existingImage[0].id, image: imageFilename }
//           );
//         } else {
//           // Insert a new image record if it doesn't exist
//           await db.query(
//             "INSERT INTO product_image (product_id, image) VALUES (:productId, :image)",
//             { productId, image: imageFilename }
//           );
//         }
//       }
//     }

//     // Send response on successful update
//     res.json({
//       message: "Data update success!",
//     });
//   } catch (error) {
//     logError("update.create", error, res);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// exports.remove = async (req, res) => {
//   try {
//     var [data] = await db.query("DELETE FROM product WHERE id = :id", {
//       id: req.body.id, // null
//     });
//     if (data.affectedRows && req.body.image != "" && req.body.image != null) {
//       removeFile(req.body.image);
//     }

//     res.json({
//       data: data,
//       message: "Data delete success!",
//     });
//   } catch (error) {
//     logError("product.remove", error, res);
//   }
// };
exports.update = async (req, res) => {
  try {
    // Ensure spacing between each clause in SQL
    var sql = `
      UPDATE product SET 
        category_id = :category_id, 
        barcode = :barcode, 
        name = :name, 
        brand = :brand, 
        description = :description, 
        qty = :qty, 
        price = :price, 
        discount = :discount, 
        status = :status, 
        image = :image 
      WHERE id = :id
    `;

    let filename = req.body.image;

    // If a new image is uploaded, use its filename
    if (req.files?.upload_image) {
      filename = req.files.upload_image[0]?.filename;
    }

    // Check if image needs to be replaced
    if (
      req.body.image &&
      req.body.image !== "null" &&
      req.files?.upload_image
    ) {
      try {
        await removeFile(req.body.image); // Remove old image
      } catch (error) {
        console.error(`Error deleting old image file: ${error.message}`);
      }
      filename = req.files.upload_image[0]?.filename;
    }

    // Check if image should be removed
    if (req.body.image_remove === "1") {
      try {
        await removeFile(req.body.image); // Remove specified image
      } catch (error) {
        console.error(`Error deleting specified image file: ${error.message}`);
      }
      filename = null;
    }

    // Update product information in the database
    const [data] = await db.query(sql, {
      ...req.body,
      image: filename == null ? "" : filename,
      create_by: req.auth?.name,
    });

    // Insert new optional images into `product_image` table
    if (req.files?.upload_image_optional) {
      const paramImageProduct = req.files.upload_image_optional.map((item) => [
        req.body.id,
        item.filename,
      ]);
      const sqlImageProduct =
        "INSERT INTO product_image (product_id, image) VALUES ?";
      await db.query(sqlImageProduct, [paramImageProduct]);
    }

    // Remove optional images
    if (req.body.image_optional && req.body.image_optional.length > 0) {
      // Ensure `image_optional` is an array
      if (typeof req.body.image_optional === "string") {
        req.body.image_optional = [req.body.image_optional];
      }

      for (const item of req.body.image_optional) {
        try {
          // Remove image entry from database
          await db.query("DELETE FROM product_image WHERE image = :image", {
            image: item,
          });
          // Remove physical file
          await removeFile(item);
        } catch (error) {
          console.error(`Error deleting optional image file: ${error.message}`);
        }
      }
    }

    res.json({
      data: data,
      message: "Data update success!",
    });
  } catch (error) {
    console.error(`Error in product.update: ${error.message}`);
    res.status(500).json({ message: "An error occurred during the update." });
  }
};

exports.remove = async (req, res) => {
  try {
    // Fetch all images from product_image associated with the product ID
    const [images] = await db.query(
      "SELECT image FROM product_image WHERE product_id = :id",
      {
        id: req.body.id,
      }
    );

    // Delete records from product_image table associated with the product ID first
    const [deleteImagesData] = await db.query(
      "DELETE FROM product_image WHERE product_id = :id",
      {
        id: req.body.id,
      }
    );

    // Now delete the product record from the product table
    const [data] = await db.query("DELETE FROM product WHERE id = :id", {
      id: req.body.id,
    });

    // If the product was deleted successfully
    if (data.affectedRows) {
      // Remove primary image if it exists
      if (req.body.image) {
        await removeFile(req.body.image).catch((err) => {
          console.error("Error removing primary image:", err);
        });
      }

      // Remove each image associated with the product
      for (const img of images) {
        await removeFile(img.image).catch((err) => {
          console.error("Error removing additional image:", err);
        });
      }
    }

    // Send response on successful deletion
    res.json({
      data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("product.remove", error, res);
  }
};

exports.productImage = async (req, res) => {
  try {
    var sql = "SELECT * FROM product_image WHERE product_id=:product_id";
    var [list] = await db.query(sql, {
      product_id: req.params.product_id,
    });
    res.json({
      list,
    });
  } catch (error) {
    logError("productImage.get", error, res);
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
    logError("product.create", error, res);
  }
};

const isExistBarcode = async (barcode) => {
  try {
    const sql = "SELECT COUNT(id) as Total FROM product WHERE barcode=:barcode";
    const [data] = await db.query(sql, { barcode });
    return data.length > 0 && data[0].Total > 0;
  } catch (error) {
    logError("isExistBarcode.check", error);
    return true; // Assume barcode exists if there's an error, to prevent duplicates
  }
};

// isExistBarcode = async (barcode) => {
//   try {
//     var sql = "SELECT COUNT(id) as Total FROM product WHERE barcode=:barcode";
//     var [data] = await db.query(sql, {
//       barcode: barcode,
//     });
//     if (data.length > 0 && data[0].Total > 0) {
//       return true; // ស្ទួន
//     }
//     return false; // អត់ស្ទួនទេ
//   } catch (error) {
//     logError("isExistBarcode.check", error, res);
//   }
// };
