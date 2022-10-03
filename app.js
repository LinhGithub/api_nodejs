const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = require("./config/Config");

const routes = require("./routes/Routes");

const app = express();

mongoose.Promise = require("bluebird");
mongoose.connect(config.DB);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes);

app.listen(config.APP_PORT, function () {
  console.log(`server: http://localhost:${config.APP_PORT}`);
});

module.exports = app;
