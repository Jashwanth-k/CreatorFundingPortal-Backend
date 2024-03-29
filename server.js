const db = require("./models/index");
const { app } = require("./app");
const scriptRouter = require("./routes/script.route");
const musicRouter = require("./routes/music.route");
const authRouter = require("./routes/auth.route");
const homeRouter = require("./routes/home.router");
const nftRouter = require("./routes/nft.route");
const favoriteRouter = require("./routes/favorite.route");
const paymentRouter = require("./routes/payment.router");
const fileRouter = require("./routes/file.route");

db.sequelize
  .sync({ force: false, alter: true })
  .then(() => init())
  .catch((err) => console.log(err));
async function init() {
  console.log("\n ----connected to DB---- \n");
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });
  await db.role.destroy({ truncate: true });
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });
  const rolesData = [{ name: "creator" }];
  db.role.bulkCreate(rolesData);
}

app.use("/script", scriptRouter);
app.use("/music", musicRouter);
app.use("/auth", authRouter);
app.use("/home", homeRouter);
app.use("/nft", nftRouter);
app.use("/favorites", favoriteRouter);
app.use("/payments", paymentRouter);
app.use("/uploads", fileRouter);

app.use("", (req, res) => res.redirect("/home"));
app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log(
    `app running on ${process.env.NODE_ENV} mode port: ${process.env.PORT}`
  );
});

process.on("uncaughtException", function (err) {
  console.log("Caught exception: ", err);
});
