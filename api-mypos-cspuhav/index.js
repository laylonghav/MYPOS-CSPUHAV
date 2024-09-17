const express = require("express"); // import express module
const app = express(); // app exttend
const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  const data = [
    {
      id: 1,
      name: "John",
    },
    {
      id: 2,
      name: "Hav",
    },
    {
      id: 3,
      name: "Mai",
    },
  ];
  res.json({
    list: data,
  });
});

// Home route
app.get("/api/home", (req, res) => {
  const data = [
    {
      title: "Customer",
      obj: { total: 1000 },
    },
    {
      title: "Sale",
      obj: { total: 1000 },
    },
    {
      title: "Expene",
      obj: { total: 1000 },
    },
    {
      title: "Employee",
      obj: { total: 1000 },
    },
  ];
  res.json({
    list: data,
  });
});

require("./src/route/category.route")(app);
require("./src/route/auth.route")(app);
require("./src/route/role.route")(app);

const PORT = 8081;
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
