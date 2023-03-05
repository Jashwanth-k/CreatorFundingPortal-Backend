const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cors({ origin: "*", credentials: true, withCredentials: true }));
app.options("*", cors());
app.use(bodyParser.json());
app.use(cookieParser());
const path = require("path");
const uploadDir = path.join(__dirname + process.env.UPLOAD_DIR);

module.exports = { app, express, uploadDir };
