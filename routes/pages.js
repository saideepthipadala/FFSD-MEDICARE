const express = require("express");
const app = express.Router();
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");

app.get("/", loggedIn, (req, res) => {
  if (req.user) {
    res.render("index", { status: "loggedIn", user: req.user });
  } else {
    res.render("index", { status: "no", user: "nothing" });
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});


// app.get("/form", (_, res) => res.render("form"));


app.get("/blogs", (_, res) => res.render("blog"));
// app.get("/doctor", (_, res) => res.render("doctor"));
app.get("/about_page", (_, res) => res.render("about_page"));
// app.get("/success", (_, res) => res.render("success"));
app.get("/hospital_reg", (_, res) => res.render("hospital_reg"));
// app.get("/admin_verification", (_, res) => res.render("admin_verification"));
app.get("/admin", (req, res) => {
  res.render("admin");
});
app.get("/contactus", (req, res) => {
  res.render("contact_us");
});

// app.get("/available_medicines", (req, res) => {
//   res.render("available_medicines");
// });



app.get("/logout", logout);

module.exports = app;
