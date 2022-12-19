const db = require("./models/index");
const fs = require("fs");
const { app } = require("./app");
const scriptRouter = require("./routes/script.route");
const musicRouter = require("./routes/music.route");
// to send images from file system
// app.use("/images", express.static("images"));

db.sequelize.sync({ force: true, alter: true }).then(() => init());
function init() {
  const userData = [
    {
      id: 1,
      name: "robert",
      email: "robert123@gmail.com",
      password: "something",
      createdAt: "2008-7-04",
      updatedAt: "2008-7-04",
    },
  ];
  const scriptData = [
    {
      id: 1,
      image: "xyz.com",
      price: 120,
      currencyType: "ethereum",
      userId: 1,
    },
    {
      id: 2,
      image: "xyz.com",
      price: 88,
      currencyType: "ethereum",
      userId: 1,
    },
  ];

  db.user.bulkCreate(userData);
  db.script.bulkCreate(scriptData);
}

app.use("/script", scriptRouter);
app.use("/music", musicRouter);

app.listen(8081, () => {
  console.log("app running");
});
