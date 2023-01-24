const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.options("*", cors());

app.use((req, res, next) => {
  res.setHeader("access-control-allow-credentials", true);
  res.setHeader(
    "access-control-allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,x-api-key"
  );
  res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE");
  res.setHeader("access-control-allow-origin", "*");
  next();
});

app.use(bodyParser.json());
module.exports = { app, express };
