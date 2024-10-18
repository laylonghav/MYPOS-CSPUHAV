const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    // const [category] = await db.query("SELECT * FROM `category`");
    // const [role] = await db.query("SELECT * FROM `role`");
    // const [supplier] = await db.query("SELECT * FROM `supplier`");
    const [product] = await db.query("SELECT * FROM `product`");

    const [category] = await db.query(
      "select id as value, name as label,description from category"
    );
    const [role] = await db.query("select id,name,code from role");
    const [supplier] = await db.query("select id,name,code from supplier");

    const purchase_status = [
      {
        value: "pending",
        label: "pending",
      },
      {
        value: "approved",
        label: "approved",
      },
      {
        value: "received",
        label: "received",
      },
      {
        value: "issues",
        label: "issues",
      },
    ];

    const brand = [
      { label: "Apple", value: "Apple", country: "USA" },
      { label: "Samsung", value: "Samsung", country: "South Korea" },
      { label: "Dell", value: "Dell", country: "USA" },
      { label: "HP", value: "HP", country: "USA" },
      { label: "Lenovo", value: "Lenovo", country: "China" },
      { label: "Asus", value: "Asus", country: "Taiwan" },
      { label: "Acer", value: "Acer", country: "Taiwan" },
      { label: "Microsoft", value: "Microsoft", country: "USA" },
    ];

    res.json({
      I_know_you_are_ID: req.current_id,
      category,
      role,
      supplier,
      product,
      purchase_status,
      brand,
    });
  } catch (error) {
    logError("config.getlist", error, res);
  }
};
