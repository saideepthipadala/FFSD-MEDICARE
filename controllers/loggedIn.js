const sqlite3 = require("sqlite3");
const jwt = require("jsonwebtoken");
sec_key = "fvbdklsfjvklasdfrj8797956";

const db = new sqlite3.Database(
  `${__dirname}/../routes/sql_login.sqlite3`,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.log(err.message);
    console.log("connection successful");
  }
);

const loggedIn = (req, res, next) => {
  if (!req.cookies.userRegistered) return next();
  try {
    const decoded = jwt.verify(req.cookies.userRegistered, sec_key);
    sql = `SELECT * from users where id = ?`;
    db.all(sql, [decoded.id], async (err, result) => {
      if (err) return next();
      req.user = result[0];
      return next();
    });
  } catch (err) {
    if (err) return next();
  }
};

module.exports = loggedIn;
