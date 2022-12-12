const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./models/index");
app.use(bodyParser.json());

db.sequelize.sync({ force: true, alter: true });
// db.script
//   .create({
//     imageSource: "abc123.com",
//     price: 100,
//     currencyType: "ethereum",
//   })
//   .then((data) => console.log(data));

app.get("/", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.writeHead(200);
  res.end(JSON.stringify({ message: "successful" }));
});

app.listen(8081, () => {
  console.log("app running");
});
