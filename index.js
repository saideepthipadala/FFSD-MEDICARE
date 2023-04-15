const fs = require("fs");
// const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { type } = require("os");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cookie = require("cookie-parser");
const PORT = 6969;
const loggedIn = require("./controllers/loggedIn");
const logout = require("./controllers/logout");

// const db = new sqlite3.Database(
//   `${__dirname}/routes/sql_login.sqlite3`,
//   sqlite3.OPEN_READWRITE,
//   (err) => {
//     if (err) return console.log(err.message);
//     console.log("connection successful");
//   }
// );

app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const hospitalSchema = {
  name: String,
  location: String,
  contactNumber: Number,
  email: String,
  noOfDoctors: Number,
};

const Hospital = mongoose.model("HospitalDetail", hospitalSchema);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/hospitals", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Display registration requests on admin page
app.get("/admin_verification", (req, res) => {
  Hospital.find({}).then((hospitals) => {
    res.render("admin_verification", { Registrations: hospitals });
  });
});

/***********************************************************************************/

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookie());
app.use(express.json());
app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth"));

app.use(express.static(path.join(__dirname, "public")));

app.post("/hospital_reg", function (req, res) {
  const hospital = new Hospital({
    name: req.body.hospitalName,
    location: req.body.location,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    noOfDoctors: req.body.numDoctors,
  });

  hospital.save().then((hospital) => {
    if (hospital) {
      console.log("Saved");
    }
  });

  res.render("success");
});

 const Drugs = [
   { name: "Aspirin" },
   { name: "Ibuprofen" },
   { name: "Paracetamol" },
   { name: "Amoxicillin" },
   { name: "Lisinopril" },
   { name: "Atorvastatin" },
   { name: "Metformin" },
   { name: "Levothyroxine" },
 ];
console.log(Drugs);

app.get("/pharmacy_registration", (req, res) => {
 
  
  res.render("pharm_reg", {Drugs: Drugs});
  
});

app.listen(PORT, () => console.log("Server listening on port: ", PORT));
