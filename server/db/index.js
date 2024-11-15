const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/server";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
