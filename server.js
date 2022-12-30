const db = require("./models/index");
const fs = require("fs");
const { app } = require("./app");
const scriptRouter = require("./routes/script.route");
const musicRouter = require("./routes/music.route");
const authRouter = require("./routes/auth.route");
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
      roleId: 2,
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

  const rolesData = [{ name: "user" }, { name: "creator" }];
  db.role.bulkCreate(rolesData);
  db.user.bulkCreate(userData);
  db.script.bulkCreate(scriptData);
}

app.use("/script", scriptRouter);
app.use("/music", musicRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log("app running");
});
