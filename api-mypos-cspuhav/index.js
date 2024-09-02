
const express = require("express"); // import express module
const app = express(); // app exttend

app.use(express.json());

category(app);
role(app);

app.get("/", (req, res) => {
  const list = [
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
  res.send(list);
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
