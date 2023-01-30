const db = require("./models/index");
const { app, express, uploadDir } = require("./app");
const scriptRouter = require("./routes/script.route");
const musicRouter = require("./routes/music.route");
const authRouter = require("./routes/auth.route");
const homeRouter = require("./routes/home.router");

db.sequelize.sync({ force: true, alter: true }).then(() => init());
function init() {
  const rolesData = [{ name: "user" }, { name: "creator" }];
  db.role.bulkCreate(rolesData);
}

app.use(process.env.UPLOAD_DIR, express.static(uploadDir));
app.use("/script", scriptRouter);
app.use("/music", musicRouter);
app.use("/auth", authRouter);
app.use("/home", homeRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `app running on ${process.env.NODE_ENV} mode port: ${process.env.PORT}`
  );
});
