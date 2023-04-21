// Import required modules
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cookie = require("cookie-parser");
const PORT = 6969;

// Import controllers
const loggedIn = require("./controllers/loggedIn");
const logout = require("./controllers/logout");

// Create Express app instance
const app = express();

// Set up MongoDB connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const uri = "mongodb+srv://ANJALI:anjali123@cluster0.1cwx1sq.mongodb.net/medicare?retryWrites=true&w=majority";
const MongooseClient = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
if (MongooseClient) {
  console.log("Connected to MongoDB");
}

// Create hospital schema for MongoDB
const hospitalSchema = {
  name: String,
  location: String,
  contactNumber: Number,
  email: String,
  noOfDoctors: Number,
};
const Hospital = mongoose.model("HospitalDetail", hospitalSchema);



// Create pharmacy schema for MongoDB
const pharmacySchema = {
  name: String,
  location: String,
  contactNumber: Number,
  email: String,
  noOfEmployees: Number,
  medicines: Array,
};
const Pharmacy = mongoose.model("PharmacyDetail", pharmacySchema);



// Set up SQLite3 connection (currently commented out)
// const db = new sqlite3.Database(
//   `${__dirname}/routes/sql_login.sqlite3`,
//   sqlite3.OPEN_READWRITE,
//   (err) => {
//     if (err) return console.log(err.message);
//     console.log("connection successful");
//   }
// );

// Set up Express app settings
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookie());
app.use(express.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Set up routes
app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth"));

// Display registration requests on admin page
app.get("/admin_verification", (req, res) => {
  Hospital.find({}).then((hospitals) => {
    res.render("admin_verification", { Registrations: hospitals });
  });
});

// Handle hospital registration form submission
app.post("/hospital_reg", async function (req, res) {
  const hospital = new Hospital({
    name: req.body.hospitalName,
    location: req.body.location,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    noOfDoctors: req.body.numDoctors,
  });

  try {
    await hospital.save();
    res.render("success");
  } catch (error) {
    console.log(error);
  }
});



// Handle pharmacies registration form submission
app.post("/pharmacy_registration", async function (req, res) {
  const pharmacy = new Pharmacy({
    name: req.body.pharmacyName,
    location: req.body.location,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    noOfEmployees: req.body.numEmployees,
    medicines: req.body.medicines,
  });

  try {
    await pharmacy.save();
    res.render("success");
  } catch (error) {
    console.log(error);
  }
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

app.get("/hospital", (req, res) => {
  Hospital.find({}).then((hospitals) => {
    res.render("hospital", { HospitalDetails: hospitals });
  });
});

app.get("/pharmecy", (req, res) => {
  Pharmacy.find({}).then((pharmacies) => {
    res.render("pharmecy", { PharmacyDetails: pharmacies});
  });
});

// Render pharmacy registration page with drug names
app.get("/pharmacy_registration", (req, res) => {
  res.render("pharm_reg", { Drugs: Drugs });
});

// Start the server
app.listen(PORT, () => console.log("Server listening on port: ", PORT));