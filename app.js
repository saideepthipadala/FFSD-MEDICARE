// Import required modules
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookie = require("cookie-parser");
const PORT = 6969;
const bcrypt = require('bcrypt');
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const User = require("./models/user_model");
const adminController = require("./controllers/adminController");
const mongoose = require("mongoose")

// Create Express app instance
const app = express();

// Create hospital schema for MongoDB
const hospitalSchema = new mongoose.Schema({
  name: String,
  location: String,
  contactNumber: Number,
  email: String,
  noOfDoctors: Number,
  approved: { type: String, default: null },
  registrationType: { type: String, default: "Hospital"},
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
  registrationType: { type: String, default: "Pharmacy" },
});
const Pharmacy = mongoose.model("PharmacyDetail", pharmacySchema);



// Set up Express app settings
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookie());
app.use(express.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Display registration requests on admin page
app.get("/admin_verification", (req, res) => {
  Hospital.find({}).then((hospitals) => {
    Pharmacy.find({}).then((pharmacies) => {
      doctor.find({}).then((doctors) => {
        res.render("admin_verification", {RegistrationHospitals: hospitals, RegistrationPharmacies: pharmacies, RegistrationDoctors: doctors,});
      }); 
    });
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


app.get("/pharmacy", async (req, res) => {
  try {
    const approvedPharmacies = await Pharmacy.find({ approved: "true" });

    res.render("pharmacy", { PharmacyDetails: approvedPharmacies });


  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/medicines/:id", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      // handle error if pharmacy is not found
      return res.status(404).send("Pharmacy not found");
    }
    res.render("available_medicines", { medicines: pharmacy.medicines });
  } catch (err) {
    // handle error
    console.error(err);
    res.status(500).send("Internal server error");
  }
});



// app.post("/available_medicines", async (req, res) => {
//   const pharmacy = await Pharmacy.findById(req.body.id);
//   res.render("available_medicines", { medicines: pharmacy.medicines });
//    res.redirect("/admin_verification");
// });

app.post("/approve", async (req, res) => {
  const id = req.body.id;
  console.log(id);
  try {
    await Hospital.findByIdAndUpdate(
      { _id: req.body.id },
      { approved: "true" }
    );

    await Pharmacy.findByIdAndUpdate(
      { _id: req.body.id },
      { approved: "true" }
    );
    await doctor.findByIdAndUpdate(
      { _id: req.body.id },
      { approved: "true" }
    );
    // console.log("Hospital approved:", hospital);
    res.redirect("/admin_verification");
  } catch (err) {
    console.log(err);
  }
});

app.post("/reject", async (req, res) => {
  const id = req.body.id;
  console.log(id);
  try {
    await Hospital.findByIdAndUpdate(
      { _id: req.body.id },
      { approved: "false" }
    );

    await Pharmacy.findByIdAndUpdate(
      { _id: req.body.id },
      { approved: "false" }
    );

     await doctor.findByIdAndUpdate(
       { _id: req.body.id },
       { approved: "false" }
     );
    // console.log("Hospital approved:", hospital);
    res.redirect("/admin_verification");
  } catch (err) {
    console.log(err);
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
  // _id: String,
  approved: { type: String, default: null },
  appointments: [appointment_schema],
  registrationType: { type: String, default: "Doctor" },
});

const doctor = mongoose.model('doctor', doctor_schema);

app.post('/doc_register', async(req, res) => {
  const hashedpass = bcrypt.hashSync(req.body.docpass, 10);
 
  const doc_object = new doctor({
    name: req.body.docname,
    gender: req.body.gender,
    specialization: req.body.specialization,
    qualification: req.body.Qualification,
    email: req.body.docemail,
    password: hashedpass,
    // _id: req.body.docemail,
  });

  // console.log(doc_object);
  // doc_object.save().then(() => {
  //   console.log("Data is Inserted");
  //   const doctor = { email: req.body.docemail };
  //   res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(doctor))}`);
  // }).catch((err) => {
  //   console.log(err);
  //   res.alert('Email Has Been Already registered');
  // })

  try {
    await doc_object.save();
    res.render("success");
  } catch (error) {
    console.log(error);
  }
})



app.get("/doc_home", (req, res) => {
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
        console.log("This appointment is accepted");
      } else {
        pending++;
      }
      if (appointment.acceptappointment === false) {
        unaccepted++;
      } else {
        accepted++;
      }
    });
    // console.log(pending);

    res.render("doc_home", {
      doctor,
      pending,
      over,
      unaccepted,
      appointments_arr,
    });
  });
});

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


// app.get('/doc_medicines', (req, res) => {
//   res.render('buy_medicines');
// })




// const doctors = [];

// doctor.find({})
//   .then((docs) => {
//     docs.forEach((doc) => {
//       doctors.push(doc);
//     });
//     console.log(doctors);
//   }
//   )
//   .catch(err => {
//     console.log(err);
//   })

app.get('/doctor', async(req, res) => {
  try {
    const approvedDoctors = await doctor.find({ approved: "true" });

    res.render("doctor", { DoctorDetails: approvedDoctors });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
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

app.get("/", authController.loggedIn, (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.render("index", { status: "loggedIn", user: req.user });
  } else {
    res.render("index", { status: "no", user: "nothing" });
  }
});

app.get("/profile", authController.loggedIn, (req, res) => {

  
  if (req.user) {
    res.render("profile", { status: "loggedIn", user: req.user });
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

app.get("/about_page", (req, res) => {
  res.render("about_page");
});

app.get("/blogs", (req, res) => {
  res.render("blog");
});

app.get("/contact_us", (req, res) => {
  res.render("contact_us");
});

app.get("/registrations", (req, res) => {
  res.render("registrations");
});

app.get("/up_role_1", (req, res) => {
  res.render("up_role_1");
});

app.get("/dashboard",adminController.dashboard_details, (req, res) => {
  console.log(req.count_details)
  if (req.count_details) {
    res.render("dashboard", { status: "loggedIn", count_details: req.count_details });
  } else {
    res.render("index");
  }
});

app.get("/logout", authController.logout);
// app.post("/signup", authControllers.signup);



app.post("/api/register", authController.signup);
app.post("/api/up_role_1", adminController.up_user_1);

app.post("/api/login", authController.login);
app.patch("/api/update_user", userController.update_details);
app.post("/admin/updateRole", adminController.updateUser)

module.exports = app;

// Start the server

