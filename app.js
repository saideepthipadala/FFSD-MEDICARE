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
const dotenv = require("dotenv");
const Hospital = require("./models/Hospital");
const Pharmacy = require("./models/Pharmacy");
const doctor = require("./models/doctor");
const appointment_schema = require("./models/appointment_schema");
const feedback_schema = require('./models/doctorfeedback');
const { log } = require("console");
// const doctor = require("./models/doctor");




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

app.get("/announcements", (req, res) => {
  res.render("announcements");
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



app.post('/doc_register', async (req, res) => {
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


  try {
    await doc_object.save();
    res.render("success");
  } catch (error) {
    console.log(error);
  }
})


// app.get('/accepted/:docId/:id', (req, res) => {
//   const { docId, id } = req.params;
//   doctor.findOne({ _id: docId }).then((doc) => {
//     if (!doc) {
//       return res.status(404).send('Doctor not found');
//     }

//     const appointment = doc.appointments.id(id);
//     if (!appointment) {
//       return res.status(404).send('Appointment not found');
//     }

//     appointment.acceptappointment = 'true';
//     return doc.save();
//   }).then(() => {
//     res.render('doc_home',doc);
//   }).catch((error) => {
//     console.error(error);
//     return res.status(500).send('Internal server error');
//   });
// });

// app.get('/accepted/:docId/:id', (req, res) => {
//   const { docId, id } = req.params;
//   doctor.findOne({ _id: docId }).then((doc) => {
//     if (!doc) {
//       return res.status(404).send('Doctor not found');
//     }

//     const appointment = doc.appointments.id(id);
//     if (!appointment) {
//       return res.status(404).send('Appointment not found');
//     }

//     appointment.acceptappointment = 'true';
//     return doc.save();
//   }).then((doc) => {
//     res.render('doc_home', { doctor: doc, appointments: doc.appointments });
//   }).catch((error) => {
//     console.error(error);
//     return res.status(500).send('Internal server error');
//   });
// });







// app.get('/rejected/:email/:id', (req, res) => {
//   const { email, id } = req.params;
//   doctor.findOne({ email }).then((doctor) => {
//     console.log(doctor);
//     // if (!doctor) {
//     //   return res.status(404).send('Doctor not found');
//     // }
//     const appointmentIndex = doctor.appointments.findIndex((appointment) => appointment.id === id);
//     if (appointmentIndex === -1) {
//       return res.status(404).send('Appointment not found');
//     }
//     doctor.appointments.splice(appointmentIndex, 1);
//     return doctor.save();
//   }).then(() => {
//     const doc = { email: email }
//     res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(doc))}`);
//     // res.redirect(`/doc_home?doctor=${encodeURIComponent(JSON.stringify(email))}`);
//     // return res.status(200).send('Appointment rejected successfully');
//   }).catch((error) => {
//     console.error(error);
//     return res.status(500).send('Internal server error');
//   });
// });




app.get("/doc_home", (req, res) => {
  res.render('doc_home');
  // const doc = JSON.parse(decodeURIComponent(req.query.doctor));
  // // console.log(doc.email);
  // doctor.findOne({ email: doc.email }).then((doctor) => {
  //   console.log(doctor);
  //   if (!doctor) {
  //     return res.status(404).send("Doctor not found");
  //   }
  //   var pending = 0;
  //   var over = 0;
  //   var unaccepted = 0;
  //   var accepted = 0;
  //   const appointments_arr = [];
  //   doctor.appointments.forEach((appointment) => {
  //     appointments_arr.push(appointment);
  //     if (appointment.appointmentStatus === true) {
  //       over++;
  //       console.log("This appointment is accepted");
  //     }
  //     else if (appointment.acceptappointment === false) {
  //       unaccepted++;
  //     } else {
  //       accepted++;
  //     }
  //   });
  //   // console.log(pending);

  //   res.render("doc_home", {
  //     doctor,
  //     pending,
  //     over,
  //     accepted,
  //     unaccepted,
  //     appointments_arr,
  //   });
  // });
});

// app.post('/doc_home', (req, res) => {
//   doctor.findOne({ email: req.body.email }).then((doctor) => {
//     if (!doctor) {
//       res.send("Doctor not found");
//     }
//     else {
//       const IsPassValid = bcrypt.compareSync(req.body.password, doctor.password);
//       if (IsPassValid) {
//         const doc = { email: req.body.email }
//         console.log(doctor);
//         res.render('doc_home', { doctor: doctor, appointments: doctor.appointments });
//       }
//       else {
//         res.send('Incorrect Password');
//       }
//     }
//   })
// })



// app.post('/doc_home', (req, res) => {
//   const id = req.body.id;
//   console.log(id)
//   doctor.findOne({ _id:id}).then((doc) => {
//     if (!doc) {
//       res.send("User not found");
//     } else {
//       doc.name = req.body.docname;
//       doc.gender = req.body.gender;
//       doc.specialization = req.body.specialization;
//       doc.qualification = req.body.Qualification;
//       const hashedpass = bcrypt.hashSync(req.body.docpass, 10);
//       doc.password = hashedpass;
//       doc.save().then(() => {
//         console.log("Doctor profile updated");
//         res.render('doc_home',{doctor:doc,appointments:doc.appointments})
//       }).catch((err) => {
//         console.log(err);
//         res.send("Error updating profile");
//       });
//     }
//   });
// });


app.post('/doc_home', (req, res) => {

  if (req.body.doctorId && req.body.appointmentId && req.body.accept) {
    const { doctorId, appointmentId } = req.body;

    // Find the doctor by ID and update the appointment status
    doctor.findOne({ _id: doctorId }).then((doc) => {
      if (!doc) {
        res.send("Doctor not found");
      } else {
        const appointment = doc.appointments.id(appointmentId);
        if (!appointment) {
          res.send("Appointment not found");
        } else {
          // Update the appointment status to 'accepted'
          appointment.acceptappointment = true;
          doc.save().then(() => {
            console.log("Appointment accepted");
            res.render('doc_home', { doctor: doc, appointments: doc.appointments });
          }).catch((err) => {
            console.log(err);
            res.send("Error accepting appointment");
          });
        }
      }
    });
  }

  else if (req.body.doctorId && req.body.appointmentId && req.body.reject) {
    const { doctorId, appointmentId } = req.body;

    doctor.findOne({ _id: doctorId }).then((doc) => {
      if (!doc) {
        return res.send("Doctor not found");
      } else {
        const appointmentIndex = doc.appointments.findIndex(appoint => appoint._id.toString() === appointmentId);

        if (appointmentIndex === -1) {
          return res.send("Appointment not found");
        } else {

          doc.appointments.splice(appointmentIndex, 1);
          doc.save().then(() => {
            console.log("Appointment rejected");
            res.render('doc_home', { doctor: doc, appointments: doc.appointments });
          }).catch((err) => {
            console.log(err);
            res.send("Error rejecting appointment");
          });
        }
      }
    });
  }



  else if (req.body.id) {
    const id = req.body.id;
    console.log(id);

    doctor.findOne({ _id: id }).then((doc) => {
      if (!doc) {
        res.send("User not found");
      } else {

        const acceptedAppoint = doc.appointments.filter((appoint) => {
          return appoint.acceptappointment === true;
        })

        const appointStatus = doc.appointments.filter((appoint) => {
          return appoint.appointmentStatus === true;
        })
        doc.name = req.body.docname;
        doc.gender = req.body.gender;
        doc.specialization = req.body.specialization;
        doc.qualification = req.body.Qualification;
        const hashedpass = bcrypt.hashSync(req.body.docpass, 10);
        doc.password = hashedpass;
        count = {
          accepted: acceptedAppoint.length,
          over: appointStatus.length,
          unaccepted: doc.appointments.length - acceptedAppoint.length
        }
        doc.save().then(() => {
          console.log("Doctor profile updated");
          res.render('doc_home', {
            doctor: doc, appointments: doc.appointments
          });
        }).catch((err) => {
          console.log(err);
          res.send("Error updating profile");
        });
      }
    });
  }
  else {
    doctor.findOne({ email: req.body.email }).then((doctor) => {
      if (!doctor) {
        res.send("Doctor not found");
      } else {
        const isPassValid = bcrypt.compareSync(req.body.password, doctor.password);
        if (isPassValid) {
          console.log(doctor);
          res.render('doc_home', { doctor: doctor, appointments: doctor.appointments });
        } else {
          res.send('Incorrect Password');
        }
      }
    });
  }
});



app.get('/success', (req, res) => {
  res.render('success');
})
app.get("/hospital_reg", (req, res) => {
  res.render("hospital_reg");
});

const appointments = mongoose.model('appointments', appointment_schema);

app.get('/form/:id', async function (req, res) {
  try {
    const id = req.params.id;
    console.log(id)
    const doc = await doctor.findOne({ _id: id });
    console.log(doc);
    res.render('form', { formDoctor: doc })
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
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

  doctor.findOne({ email }).then((doc) => {
    if (!doc) {
      console.log("No doctor Found");
    }
    else {
      if (doc.appointments == null) {
        doc.appointments = [];
      }
      doc.appointments.push(appointment);
      console.log(doc);
      doc.save().then(() => {
        console.log("form data submitted to database");
        res.redirect('/success');
      }).catch((err) => {
        console.log(err);
      })
    }
  })
})

app.get("/feedback/:email", authController.loggedIn, (req, res) => {
  const email = req.params.email; // Use req.params.email to extract the email parameter
  console.log(email);
  if (req.user) {
    res.render("feedback", { status: "loggedIn", user: req.user, email: email });
  } else {
    res.render("index", { status: "no", user: "nothing" });
  }
});


const Feedback = mongoose.model('Feedback', feedback_schema);

app.post('/feedback', authController.loggedIn, async (req, res) => {
  const { username, email, message, docemail } = req.body;
  console.log(docemail);
  try {
    const doctor = await doctor.findOne({ docemail });

    const feedback = new Feedback({ username, email, message, docemail });
    doctor.feedbacks.push(feedback);
    await doctor.save();
    res.send("feedback sent");
    console.log(doctor.feedbacks);
    // res.render('feedback', { status: 'success', user: req.user });
  } catch (error) {
    console.error(error);
    res.send("Error in sending feedback");
    // res.render('feedback', { status: 'error', user: req.user });
  }
});



app.get('/doc_login', (req, res) => {
  res.render('doc_login');
})




app.get('/doctor', async (req, res) => {
  try {
    const approvedDoctors = await doctor.find({ approved: "true" });
    res.render("doctor", { DoctorDetails: approvedDoctors });
    // res.json({approvedDoctors});
    console.log(approvedDoctors)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})



// app.get('/filter', (req, res) => {
//   console.log(req.query);
//   const specialization = req.query.docspec;
//   console.log(specialization);
//   doctor.find({ specialization: specialization }).then((doctors) => {
//     res.render('doctor', {
//       DoctorDetails: doctors
//     });
//   })
//     .catch((err) => {
//       console.log(err);
//     })

// })

// app.get("/search", async (req, res) => {
//   const searchTerm = req.query.docname;
//   console.log(searchTerm);
//   let results;
//   try {
//     results = await doctor.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
//         res.render('doctor', {
//       DoctorDetails: results
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });





// app.post('/doc_home/:id', (req, res) => {
//   const docId = req.params.id;
//   doctor.findOne({ _id: docId }).then((doc) => {
//     if (!doc) {
//       res.send("User not found");
//     } else {
//       doc.name = req.body.docname;
//       doc.gender = req.body.gender;
//       doc.specialization = req.body.specialization;
//       doc.qualification = req.body.Qualification;
//       const hashedpass = bcrypt.hashSync(req.body.docpass, 10);
//       doc.password = hashedpass;
//       doc.save().then(() => {
//         console.log("Doctor profile updated");
//         res.render('doc_home', { doctor: doc, appointments: doc.appointments });
//       }).catch((err) => {
//         console.log(err);
//         res.send("Error updating profile");
//       });
//     }
//   })
// });




app.get("/", authController.loggedIn, (req, res) => {
  console.log(req.user);
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


// const hospitalscount = await Hospital.countDocuments({approved:"true"});
// const pharmaciescount = await Pharmacy.countDocuments({ approved: "true" });
// const doctorscount = await doctor.countDocuments({ approved: "true" });
// const pendinghosp = await Hospital.countDocuments({ approved: "null" });
// const pendingpharm = await Hospital.countDocuments({ approved: "null" });
// const pendingdoct = await Hospital.countDocuments({ approved: "null" });


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
app.post("/admin/updateRole", adminController.updateUser)

module.exports = app;