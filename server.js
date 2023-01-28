const db = require("./models/index");
const { app, express } = require("./app");
const scriptRouter = require("./routes/script.route");
const musicRouter = require("./routes/music.route");
const authRouter = require("./routes/auth.route");

db.sequelize.sync({ force: true, alter: true }).then(() => init());
function init() {
  const rolesData = [{ name: "user" }, { name: "creator" }];
  db.role.bulkCreate(rolesData);
}

app.use(
  process.env.UPLOAD_DIR,
  express.static(__dirname + process.env.UPLOAD_DIR)
);
app.use("/script", scriptRouter);
app.use("/music", musicRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `app running on ${process.env.NODE_ENV} mode port: ${process.env.PORT}`
  );
});
