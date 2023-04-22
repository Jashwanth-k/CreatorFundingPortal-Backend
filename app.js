const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const nocache = require("nocache");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(nocache());
app.set("etag", false);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

module.exports = { app, express };
