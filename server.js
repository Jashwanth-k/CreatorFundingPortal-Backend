const db = require("./models/index");
const fs = require("fs");
const app = require("./app");
// to send images from file system
// app.use("/images", express.static("images"));

db.sequelize.sync({ force: true, alter: true });

app.get("/", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.writeHead(200);
  res.end(JSON.stringify(compressed));
});

app.listen(8081, () => {
  console.log("app running");
});
