const jwt = require("jsonwebtoken");
var now = new Date();
let time = now.getTime();
const sqlite3 = require("sqlite3");
const bcrypt = require("bcryptjs");
sec_key = "fvbdklsfjvklasdfrj8797956";

const db = new sqlite3.Database(
  `${__dirname}/../routes/sql_login.sqlite3`,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.log(err.message);
    console.log("connection successful");
  }
);

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({
      status: "error",
      error: "Please enter your email and password",
    });
  else {
    sql = `SELECT* from users where email = ?`;
    db.all(sql, [email], async (err, result) => {
      if (err) throw err;
      if (
        !result.length ||
        !(await bcrypt.compare(password, result[0].password))
      )
        return res.json({
          status: "error",
          error: "Incorrect email or password",
        });
      else {
        const token = jwt.sign({ id: result[0].id }, sec_key, {
          expiresIn: time + 1000 * 60,
          // httpOnly: true,
        });
        const cookieOptions = {
          expiresIn: time + 1000 * 60 * 90 * 24 * 60,
          httpOnly: true,
        };
        res.cookie("userRegistered", token, cookieOptions);
        return res.json({
          status: "success",
          success: "User has been logged in",
        });
      }
    });
  }
};

module.exports = login;
