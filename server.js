const db = require("./models/index");
const fs = require("fs");
const { app } = require("./app");
const cors = require("cors");
const scriptRouter = require("./routes/script.route");
const musicRouter = require("./routes/music.route");
const authRouter = require("./routes/auth.route");
// to send images from file system
// app.use("/images", express.static("images"));
const corsOpt = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpt));

db.sequelize.sync({ force: true, alter: true }).then(() => init());
function init() {
  const rolesData = [{ name: "user" }, { name: "creator" }];
  db.role.bulkCreate(rolesData);
}

app.use("/script", scriptRouter);
app.use("/music", musicRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `app running on ${process.env.NODE_ENV} mode port: ${process.env.PORT}`
  );
});
