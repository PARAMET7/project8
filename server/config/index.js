const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config()

module.exports = (app) => {
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: [process.env.CLIENT_URL],
      credentials: true
    })
  );
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
