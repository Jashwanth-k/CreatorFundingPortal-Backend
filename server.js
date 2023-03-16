const db = require("./models/index");
const { app, express, uploadDir } = require("./app");
const scriptRouter = require("./routes/script.route");
const musicRouter = require("./routes/music.route");
const authRouter = require("./routes/auth.route");
const homeRouter = require("./routes/home.router");
const nftRouter = require("./routes/nft.route");
const favoriteRouter = require("./routes/favorite.route");
const paymentRouter = require("./routes/payment.router");

db.sequelize.sync({ force: false, alter: true }).then(() => init());
function init() {
  const rolesData = [{ name: "user" }, { name: "creator" }];
  db.role.bulkCreate(rolesData);
}

app.use("/script", scriptRouter);
app.use("/music", musicRouter);
app.use("/auth", authRouter);
app.use("/home", homeRouter);
app.use("/nft", nftRouter);
app.use("/favorites", favoriteRouter);
app.use("/payments", paymentRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `app running on ${process.env.NODE_ENV} mode port: ${process.env.PORT}`
  );
});
