const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const User = require("./models/user_model");
const express = require("express");

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.NEW_DATABASE_USER_PASSWORD
);

console.log(DB)

mongoose
.connect(DB)
.then((con) => {
    console.log("DB connection successful");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
