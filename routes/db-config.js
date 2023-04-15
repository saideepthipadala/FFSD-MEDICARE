const fs = require("fs");
const express = require("express");
const { type } = require("os");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  `${__dirname}/sql_login.sqlite3`,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.log(err.message);
    console.log("connection successful");
  }
);

// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY,Name,Email_id,Password)`;
// sql = `INSERT INTO users(Name,Email_id,Password) VALUES('Anjali kumari','anjali.k21@gmail.com','12345')`;

// sql = `SELECT* FROM users`;
// db.all(sql, [], (err, rows) => {
//   if (err) return console.error(err.message);
//   rows.forEach((row) => {
//     console.log(row);
//   });
// });

// sql = `INSERT INTO users(email,password,fullname) VALUES('anjali.k21@gmail.com','12345','Anjali kumari')`;

// sql = `TRUNCATE TABLE users`;
// const name = `Anjali kumari`;
// sql = `DELETE FROM users WHERE Name = ${name}`;

// sql = `SELECT* FROM users`;

// db.all(sql, [], (err, rows) => {
//   if (err) return console.error(err.message);
//   rows.forEach((row) => {
//     console.log(row);
//   });
// });

// sql = `DELETE FROM users WHERE id = 3`;

// sql = `CREATE TABLE users(id INTEGER PRIMARY KEY,email,password,fullname)`;
// sql = `DROP TABLE users`;
// db.run(sql);

// db.run(sql);

module.exports = db;
