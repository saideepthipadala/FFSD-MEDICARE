const sqlite3 = require("sqlite3");
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database(
  `${__dirname}/../routes/sql_login.sqlite3`,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.log(err.message);
    console.log("connection successful");
  }
);

const register = async (req, res) => {
  const { email, password: Npassword, fullname } = req.body;
  if (!email || !Npassword || !fullname)
    return res.json({
      status: "error",
      error: "Please enter your email and password",
    });
  else {
    // console.log(email);
    sql = `SELECT email from users where email = ?`;
    db.all(sql, [email], async (err, result) => {
      if (err) throw err;
      if (result[0])
        return res.json({
          status: "error",
          error: "Email has already been registered",
        });
      else {
        const password = await bcrypt.hash(Npassword, 8);
        console.log(password);
        db.all(
          "INSERT INTO users(email ,password ,fullname) VALUES(?,?,?)",
          [email, password, fullname],
          (error, results) => {
            if (error) throw error;
            return res.json({
              status: "success",
              success: "User has been registered",
            });
          }
        );
      }
    });
  }
};

module.exports = register;
