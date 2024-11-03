const { db, logError } = require("../util/helper");

exports.getlist = async (req, res) => {
  try {
    // const [category] = await db.query("SELECT * FROM `category`");
    // const [role] = await db.query("SELECT * FROM `role`");
    // const [supplier] = await db.query("SELECT * FROM `supplier`");
    const [product] = await db.query(
      "SELECT `id` AS value, `category_id`, `barcode`, `name` AS label, `brand`, `description`, `qty`, `price`, `discount`, `status`, `image`, `create_by`, `create_at` FROM `product`"
    );

    const [category] = await db.query(
      "select id as value, name as label,description from category"
    );
    const [role] = await db.query(
      "select id as value,name as label,code from role"
    );
    const [expense_type] = await db.query(
      "select id as value,name as label,code from expense_type"
    );
    const [supplier] = await db.query(
      "select id as value,name as label,code from supplier"
    );
    let sql = `
  SELECT p.id AS value, 
         p.supplier_id,  
         p.ref AS label, 
         p.ship_cost, 
         p.paid_amount, 
         p.paid_date, 
         p.status, 
         p.create_by, 
         p.create_at, 
         p.ship_company,      -- Add this line if ship_company exists in the purchase table
         s.name AS supplier_name
  FROM purchase p
  INNER JOIN supplier s 
    ON p.supplier_id = s.id
  WHERE 1
`;

    const [Purchase] = await db.query(sql);

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
      {
        value: "Canceled",
        label: "Canceled",
      },
      {
        value: "Completed",
        label: "Completed",
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
      expense_type,
      Purchase,
    });
  } catch (error) {
    logError("config.getlist", error, res);
  }
};
