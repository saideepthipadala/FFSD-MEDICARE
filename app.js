// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookie = require("cookie-parser");
const bcrypt = require('bcrypt');
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const adminController = require("./controllers/adminController");
const mongoose = require("mongoose")
const Hospital = require("./models/Hospital");
const Pharmacy = require("./models/Pharmacy");
const doctor = require("./models/doctor");
const appointment_schema = require("./models/appointment_schema");
const Announcement = require("./models/Announcement");
const User = require("./models/user_model");



// Create Express app instance
const app = express();

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
        res.render("admin_verification", { RegistrationHospitals: hospitals, RegistrationPharmacies: pharmacies, RegistrationDoctors: doctors, },);
      });

    });
  });
});


app.get("/allUsers", (req, res) => {

  User.find().then((users) => {
    doctor.find({}).then((doctors) => {
      res.render("allUsers", { users: users, doctors: doctors },);
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
  { name: "Acetaminophen" },
  { name: "Omeprazole" },
  { name: "Losartan" },
  { name: "Amlodipine" },
  { name: "Escitalopram" },
  { name: "Tramadol" },
  { name: "Zolpidem" },
  { name: "Furosemide" },
  { name: "Lisinopril" }
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

app.get("/admin_announcements", async (req, res) => {
  try {
    res.render("admin_announcements");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find({});
    res.render("announcements", { announcements: announcements });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});



app.post("/admin_announcements", async (req, res) => {
  try {
    const { announcement_title, announcement_content } = req.body;
    const newAnnouncement = await Announcement.create({
      title: announcement_title,
      content: announcement_content,
      date: Date.now()
    });
    res.redirect('/announcements');
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
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





app.post("/approve", async (req, res) => {
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
    res.redirect("/admin_verification");
  } catch (err) {
    console.log(err);
  }
});

app.post("/reject", async (req, res) => {
  const id = req.body.id;
 // console.log(id);
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
app.get("/pharm_reg", (req, res) => {
  res.render("pharm_reg", { Drugs: Drugs });
});



app.get('/doc_register', (req, res) => {
  res.render('doc_register');
})



app.post('/doc_register', async (req, res) => {
  const hashedpass = bcrypt.hashSync(req.body.docpass, 10);

  const doc_object = new doctor({
    name: req.body.docname,
    gender: req.body.gender,
    specialization: req.body.specialization,
    qualification: req.body.Qualification,
    email: req.body.docemail,
    password: hashedpass,
  });


  try {
    await doc_object.save();
    res.render("success");
  } catch (error) {
    console.log(error);
  }
})


app.get('/accepted/:email/:id', (req, res) => {
  const { email, id } = req.params;
  doctor.findOne({ email }).then((doctor) => {
    if (!doctor) {
      return res.status(404).send('Doctor not found');
    }

    const appointment = doctor.appointments.id(id);
    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    appointment.acceptappointment = 'true';
    return doctor.save();
  }).then(() => {
    // res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(email))}`);
    const doc = { email: email }
    res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(doc))}`);
  }).catch((error) => {
    console.error(error);
    return res.status(500).send('Internal server error');
  });
});

app.get('/rejected/:email/:id', (req, res) => {
  const { email, id } = req.params;
  doctor.findOne({ email }).then((doctor) => {
    // console.log(doctor);

    const appointmentIndex = doctor.appointments.findIndex((appointment) => appointment.id === id);
    if (appointmentIndex === -1) {
      return res.status(404).send('Appointment not found');
    }
    doctor.appointments.splice(appointmentIndex, 1);
    return doctor.save();
  }).then(() => {
    // res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(email))}`);
    const doc = { email: email }
    res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(doc))}`);
  }).catch((error) => {
    console.error(error);
    return res.status(500).send('Internal server error');
  });
});



app.get("/doc_home", (req, res) => {
  const doc = JSON.parse(decodeURIComponent(req.query.doctor));
  // console.log(doc.email);
  doctor.findOne({ email: doc.email }).then((doctor) => {
    // console.log(doctor);
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }
    var pending = 0;
    var over = 0;
    var unaccepted = 0;
    var accepted = 0;
    const appointments_arr = [];
    doctor.appointments.forEach((appointment) => {
      appointments_arr.push(appointment);
      if (appointment.appointmentStatus === true) {
        over++;
       // console.log("This appointment is accepted");
      }
      else if (appointment.acceptappointment === false) {
        unaccepted++;
      } else {
        accepted++;
      }
    });
    const feedbacks_arr = [];
    doctor.feedback.forEach((feedback)=>{
      feedbacks_arr.push(feedback);
    })
    // console.log(pending);
   // console.log(feedbacks_arr);

    res.render("doc_home", {
      feedbacks_arr,
      doctor,
      pending,
      over,
      accepted,
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
app.get("/hospital_reg", (req, res) => {
  res.render("hospital_reg");
});

const appointments = mongoose.model('appointments', appointment_schema);

app.get('/form', function (req, res) {
  const email = req.query.name.split('|')[1];
  // console.log(email);
  res.render('form', { email });
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
  // console.log(appointment);
  // console.log(name);
  // console.log(email);
  doctor.findOne({ email }).then((doc) => {
    if (!doc) {
      // console.log("No doctor Found");
    }
    else {
      if (doc.appointments == null) {
        doc.appointments = [];
      }
      doc.appointments.push(appointment);
      // console.log(doc);
      doc.save().then(() => {
        //console.log("form data submitted to database");
        res.redirect('/success');
      }).catch((err) => {
        console.log(err);
      })
    }
  })
})


app.get('/doc_login', (req, res) => {
  res.render('doc_login');
})




app.get('/doctor', async (req, res) => {
  try {
    const approvedDoctors = await doctor.find({ approved: "true" });

    res.render("doctor", { DoctorDetails: approvedDoctors });
    // console.log(approvedDoctors)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})



app.get('/filter', (req, res) => {
  //console.log(req.query);
  const specialization = req.query.docspec;
  // console.log(specialization);
  doctor.find({ specialization: specialization }).then((doctors) => {
    res.render('doctor', {
      DoctorDetails: doctors
    });
  })
    .catch((err) => {
      console.log(err);
    })

})

app.get('/search', (req, res) => {
  // console.log(req.query);
  const name = req.query.docname;
  doctor.find({ name: { $regex: new RegExp(name, 'i') } }).then((doctors) => {
    res.render('doctor', {
      DoctorDetails: doctors
    });
  })
    .catch((err) => {
      console.log(err);
    })
})



app.post('/doc_home', (req, res) => {
  // console.log(req.body);
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
       // console.log("Doctor profile updated");
        res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(doc))}`);
      }).catch((err) => {
        console.log(err);
        res.send("Error updating profile");
      });
    }
  });
});

app.get("/", authController.loggedIn, (req, res) => {
  // console.log(req.user);
  if (req.user) {
    res.render("index", { status: "loggedIn", user: req.user });
  } else {
    res.render("index", { status: "no", user: "nothing" });
  }
});

app.get("/contact_us", authController.loggedIn, (req, res) => {

  if (req.user) {
    res.render("contact_us", { status: "loggedIn", user: req.user });
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



app.get("/registrations", (req, res) => {
  res.render("registrations");
});

app.get("/up_role_1", (req, res) => {
  res.render("up_role_1");
});




app.get("/dashboard", adminController.dashboard_details, (req, res) => {
  console.log(req.count_details)
  if (req.count_details) {
    res.render("dashboard", { status: "loggedIn", count_details: req.count_details });
  } else {
    res.render("index");
  }
});

app.get("/logout", authController.logout);



app.post("/api/register", authController.signup);
app.post("/api/up_role_1", adminController.up_user_1);
app.post("/api/up_role", adminController.updateUser);
app.post("/api/contact_us", userController.send_data);

app.post("/api/login", authController.login);
app.patch("/api/update_user", userController.update_details);
app.post("/admin/updateRole", adminController.updateUser);

app.get("/doc_feedback", (req, res) => {
  res.render("doc_feedback");
})

app.patch("/api/feedback",userController.send_feedback);

module.exports = app;