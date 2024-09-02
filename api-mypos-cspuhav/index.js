
const express = require("express");
const app =express();

app.use(express.json());


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