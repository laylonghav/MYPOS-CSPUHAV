const {
  db,
  isArray,
  isEmpty,
  logError,
  removeFile,
} = require("../util/helper");

// exports.getlist = async (req, res) => {
//   try {
//     // Destructuring req.body to get the parameters
//     const { txtsearch, category_id, brand } = req.query; // Extract fields from req.body

//     // console.log("body: ", req.body); // Log request body
//     // console.log("query: ", req.query); // Log query parameters (for GET requests)

//     // res.json({
//     //   body: req.body, // Return the body as part of the response
//     //   query: req.query, // Return the query as part of the response
//     // });

//     // return; // Ensure the function returns after sending the response
//     // Creating an SQL query with proper spaces between sections

//     // query:  { txtsearch: 'a', category_id: 'a', brand: 'a' }

//     var sql = `
//       SELECT p.*,
//              c.name AS category_name
//       FROM product p
//       INNER JOIN category c
//         ON p.category_id = c.id
//       WHERE 1
//     `;

//     // Adding conditions dynamically based on the parameters received

//     if (category_id) {
//       sql += " AND p.category_id = :category_id";
//     }
//     if (txtsearch) {
//       sql += " AND p.name LIKE :txtsearch OR p.barcode = :barcode";
//     }
//     if (brand) {
//       sql += " AND p.brand = :brand";
//     }

//     // Executing the query with the parameters
//     const [list] = await db.query(sql, {
//       txtsearch: "%" + txtsearch + "%",
//       category_id: category_id,
//       barcode: txtsearch,
//       brand: brand,
//     });

//     // Sending the response
//     res.json({
//       i_know_you_are_id: req.current_id,
//       list: list,
//     });
//   } catch (error) {
//     logError("product.getList", error, res);
//   }
// };

// exports.create = async (req, res) => {
//   try {
//     if (await isExistBarcode(req.barcode)) {
//       res.json({
//         error: {
//           barcode: "Barcode already exist.",
//         },
//       });
//       return false;
//     }
//     // console.log(req.files)
//     // res.json({
//     //   body: req.body,
//     //   file: req.files,
//     //   message: "Insert success!",
//     // });
//     // return;

//     var sql =
//       " INSERT INTO product (category_id, barcode,name,brand,description,qty,price,discount,status,image,create_by ) " +
//       " VALUES (:category_id, :barcode, :name, :brand, :description, :qty, :price, :discount, :status, :image, :create_by ) ";
//     var [data] = await db.query(sql, {
//       ...req.body,
//       image: req.files?.upload_image[0].filename,
//       create_by: req.auth?.name,
//     });
//     var paramImageProduct = [];
//     if (req.files && req.files?.upload_image_optional) {
//       req.files?.upload_image_optional.map((item, index) => {
//         paramImageProduct.push([data.insertId, item.filename]);
//       });
//     }
//     var sqlImageProduct =
//       "INSERT INTO `product_image`(`id`, `product_id`, `image`) VALUES :data";
//     var [dataImage] = await db.query(sqlImageProduct, {
//       data: paramImageProduct
//     });
//     res.json({
//       data,
//       dataImage,
//       message: "Insert success!",
//     });
//   } catch (error) {
//     logError("product.create", error, res);
//   }
// };

exports.getlist = async (req, res) => {
  try {
    const { txtsearch, category_id, brand } = req.query;

    // Base SQL query with joins to fetch products and associated category and images
    let sql = `
      SELECT p.*, 
             c.name AS category_name,
             pi.image AS product_image,
             pi.id AS product_image_id
      FROM product p
      INNER JOIN category c 
        ON p.category_id = c.id
      LEFT JOIN product_image pi
        ON pi.product_id = p.id
      WHERE 1 
    `;

    // Add conditions dynamically based on parameters
    const queryParams = {};
    if (category_id) {
      sql += " AND p.category_id = :category_id";
      queryParams.category_id = category_id;
    }
    if (txtsearch) {
      sql += " AND (p.name LIKE :txtsearch OR p.barcode = :barcode)";
      queryParams.txtsearch = "%" + txtsearch + "%";
      queryParams.barcode = txtsearch;
    }
    if (brand) {
      sql += " AND p.brand = :brand";
      queryParams.brand = brand;
    }

    // Add ORDER BY clause to sort by product ID
    sql += " ORDER BY id DESC";

    // Execute the query with parameters
    const [results] = await db.query(sql, queryParams);

    // Transform results to group product images into an array
    const list = [];
    const productMap = new Map();

    results.forEach((row) => {
      const productId = row.id;

      if (!productMap.has(productId)) {
        productMap.set(productId, {
          ...row,
          product_image: [], // Initialize image array
        });
      }

      // Push the image to the product_image array
      if (row.product_image) {
        productMap.get(productId).product_image.push(row.product_image);
      }
    });

    // Convert the map to an array
    productMap.forEach((product) => list.push(product));

    res.json({
      i_know_you_are_id: req.current_id,
      list: list,
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
    const sql =
      "UPDATE product SET category_id = :category_id, barcode = :barcode, name = :name," +
      "brand = :brand, description = :description, qty = :qty, price = :price," +
      "discount = :discount, status = :status, image = :image " +
      "WHERE id = :id";

    let filename = req.body.image; // Default to existing image

    if (!filename && req.files?.upload_image) {
      filename = req.files.upload_image[0].filename;
    }

    if (req.body.image && req.files?.upload_image) {
      await removeFile(req.body.image).catch((err) =>
        console.error("Error removing old image:", err)
      );
      filename = req.files.upload_image[0].filename;
    }

    if (req.body.image_remove === "1") {
      await removeFile(req.body.image).catch((err) =>
        console.error("Error removing image:", err)
      );
      filename = null;
    }

    const [data] = await db.query(sql, {
      ...req.body,
      image: filename,
      create_by: req.auth?.name,
    });

    if (req.files?.upload_image_optional) {
      const productId = req.body.id; // Use the ID from request body

      for (const item of req.files.upload_image_optional) {
        const imageFilename = item.filename;

        const [existingImage] = await db.query(
          "SELECT id, image FROM product_image WHERE product_id = :productId AND image = :image",
          { productId, image: imageFilename }
        );

        if (existingImage.length > 0) {
          await removeFile(existingImage[0].image).catch((err) =>
            console.error("Error removing existing image:", err)
          );
          await db.query(
            "UPDATE product_image SET image = :image WHERE id = :id",
            { id: existingImage[0].id, image: imageFilename }
          );
        } else {
          await db.query(
            "INSERT INTO product_image (product_id, image) VALUES (:productId, :image)",
            { productId, image: imageFilename }
          );
        }
      }
    }

    
    if (req.body.remove_image_optional) {
      await db.query(
        "DELETE FROM product_image WHERE product_id = :productId AND image = :image",
        { productId: req.body.id, image: req.body.remove_image_optional }
      );
      await removeFile(req.body.remove_image_optional).catch((err) =>
        console.error("Error removing product image file:", err)
      );
    }

    res.json({
      data: data,
      message: "Data update success!",
    });
  } catch (error) {
    logError("update.create", error, res);
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
