// Import required modules
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
// const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cookie = require("cookie-parser");
const PORT = 6969;
const bcrypt = require('bcrypt');
// Import controllers
const loggedIn = require("./controllers/loggedIn");
const logout = require("./controllers/logout");

// Create Express app instance
const app = express();

// Set up MongoDB connection
const mongoose = require("mongoose");
const { log } = require("console");
mongoose.set("strictQuery", true);
const uri =
  "mongodb+srv://ANJALI:anjali123@cluster0.1cwx1sq.mongodb.net/medicare?retryWrites=true&w=majority";
const MongooseClient = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
if (MongooseClient) {
  console.log("Connected to MongoDB");
}

// Create hospital schema for MongoDB
const hospitalSchema = new mongoose.Schema({
  name: String,
  location: String,
  contactNumber: Number,
  email: String,
  noOfDoctors: Number,
  approved: { type:String, default: null},
});

const Hospital = mongoose.model("HospitalDetail", hospitalSchema);


// Create pharmacy schema for MongoDB
const pharmacySchema = new mongoose.Schema({
  name: String,
  location: String,
  contactNumber: Number,
  email: String,
  noOfEmployees: Number,
  medicines: Array,
  approved: { type: String, default: null },
});
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
    Pharmacy.find({}).then((pharmacies) => {
      res.render("admin_verification", {
        Registrations: hospitals,
        RegistrationPharmacies: pharmacies,
      });
    })
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


// console.log(Drugs);

app.get("/hospital", async (req, res) => {
  try {
    const approvedHospitals = await Hospital.find({ approved: "true" });
  
     res.render("hospital", { HospitalDetails: approvedHospitals });
 

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/pharmacy", async(req, res) => {
 try {
    const approvedPharmacies = await Pharmacy.find({ approved: "true" });
  
     res.render("pharmacy", { PharmacyDetails: approvedPharmacies });
 

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Render pharmacy registration page with drug names
app.get("/pharmacy_registration", (req, res) => {
  res.render("pharm_reg", { Drugs: Drugs });
});

app.get('/doc_register', (req, res) => {
  res.render('doc_register');
})

const appointment_schema = new mongoose.Schema({
  patientname: String,
  patientgender: String,
  patientage: Number,
  patientproblem: String,
  appointdate: Date,
  appointtime: String,
  acceptappointment: Boolean,
  appointmentStatus: Boolean
});

const doctor_schema = new mongoose.Schema({
  name: String,
  gender: String,
  specialization: String,
  qualification: String,
  email: String,
  password: String,
  _id: String,
  approved: Boolean,
  appointments: [appointment_schema],
});

const doctor = mongoose.model('doctor', doctor_schema);

app.post('/doc_register', (req, res) => {
  const hashedpass = bcrypt.hashSync(req.body.docpass, 10);
  const doc_object = new doctor({
    name: req.body.docname,
    gender: req.body.gender,
    specialization: req.body.specialization,
    qualification: req.body.Qualification,
    email: req.body.docemail,
    password: hashedpass,
    _id: req.body.docemail,
    approved: false,
  });
  console.log(doc_object);
  doc_object.save().then(() => {
    console.log("Data is Inserted");
    const doctor = { email: req.body.docemail };
    res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(doctor))}`);
  }).catch((err) => {
    console.log(err);
    res.send('Email Has Been Already registered');
  })
})

app.get('/doc_home', (req, res) => {
  const doc = JSON.parse(decodeURIComponent(req.query.doctor));
  doctor.findOne({ email: doc.email }).then((doctor) => {
    var pending = 0;
    var over = 0;
    var unaccepted = 0;
    var accepted = 0;
    const appointments_arr = [];
    doctor.appointments.forEach((appointment) => {
      appointments_arr.push(appointment);
      if (appointment.appointmentStatus === true) {
        over++;
        console.log('This appointment is accepted');
      } else {
        pending++;
      }
      if (appointment.acceptappointment === false) {
        unaccepted++;
      }
      else {
        accepted++;
      }
    });
    // console.log(pending);

    res.render('doc_home', {
      doctor, pending, over, unaccepted, appointments_arr
    })
  }
  )
})

app.post('/doc_login', (req, res) => {
  doctor.findOne({ email: req.body.email }).then((doctor) => {
    if (!doctor) {
      res.send("User not found");
    }
    else {
      const IsPassValid = bcrypt.compareSync(req.body.password, doctor.password);
      if (IsPassValid) {
        const doc = { email: req.body.email }
        res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(doc))}`);
      }
      else {
        res.send('Incorrect Password');
      }
    }
  })
})

app.get('/success', (req, res) => {
  res.render('success');
})

const appointments = mongoose.model('appointments', appointment_schema);

app.get('/form', function (req, res) {
  const email = req.query.name.split('|')[1];
  // console.log(email);
  res.render('form', {
    email
  });
});


app.post('/form', (req, res) => {
  // const name = req.query.name;
  const email = req.query.email;
  const appointment = new appointments({
    patientname: req.body.name,
    patientgender: req.body.gender,
    patientage: req.body.age,
    patientproblem: req.body.problem,
    appointdate: req.body.date,
    appointtime: req.body.time,
    acceptappointment: false,
    appointmentStatus: false
  });
  // console.log(name);
  // console.log(email);
  doctor.findById(email).then((doctor) => {
    if (!doctor) {
      console.log("No doctor Found");
    }
    else {
      doctor.appointments.push(appointment);
    }

    doctor.save().then(() => {
      console.log("form data submitted to database");
      res.redirect('/success');
    }).catch((err) => {
      console.log(err);
    })
  })
})


app.get('/doc_login', (req, res) => {
  res.render('doc_login');
})


app.get('/doc_medicines', (req, res) => {
  res.render('buy_medicines');
})




const doctors = [];

doctor.find({})
  .then((docs) => {
    docs.forEach((doc) => {
      doctors.push(doc);
    });
    console.log(doctors);
  }
  )
  .catch(err => {
    console.log(err);
  })

app.get('/doctor', (req, res) => {
  res.render('doctor', {
    doctors: doctors
  });
})

app.get('/filter', (req, res) => {
  console.log(req.query);
  const specialization = req.query.docspec;
  console.log(specialization);
  doctor.find({ specialization: specialization }).then((doctors) => {
    res.render('doctor', {
      doctors
    });
  })
    .catch((err) => {
      console.log(err);
    })

})

app.get('/search', (req, res) => {
  console.log(req.query);
  const name = req.query.docname;
  doctor.find({ name: { $regex: new RegExp(name, 'i') } }).then((doctors) => {
    res.render('doctor', {
      doctors
    });
  })
    .catch((err) => {
      console.log(err);
    })
})

// app.get('/accept',(req,res)=>{
//   console.log(req.query);
// })

app.post('/doc_home', (req, res) => {
  console.log(req.body);
  doctor.findOne({ email: req.body.docemail }).then((doc) => {
    if (!doc) {
      res.send("User not found");
    } else {
      doc.name = req.body.docname;
      doc.gender = req.body.gender;
      doc.specialization = req.body.specialization;
      doc.qualification = req.body.Qualification;
      const hashedpass = bcrypt.hashSync(req.body.docpass, 10);
      doc.password = hashedpass;
      doc.save().then(() => {
        console.log("Doctor profile updated");
        res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(doc))}`);
      }).catch((err) => {
        console.log(err);
        res.send("Error updating profile");
      });
    }
  });
});


// Start the server
app.listen(PORT, () => console.log("Server listening on port: ", PORT));

