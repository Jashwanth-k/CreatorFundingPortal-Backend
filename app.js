const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
const path = require("path");
const uploadDir = path.join(__dirname + process.env.UPLOAD_DIR);

module.exports = { app, express, uploadDir };
