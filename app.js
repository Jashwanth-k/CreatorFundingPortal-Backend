const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.options("*", cors());
app.use(bodyParser.json());
module.exports = { app, express };
