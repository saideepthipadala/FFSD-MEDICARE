
const User = require("./../models/user_model");

const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const Hospital = require("./../models/Hospital");
const Pharmacy = require("./../models/Pharmacy");
const doctor = require("./../models/doctor");


exports.dashboard_details = async (req, res, next) => {

  const count_users = (await User.find().count());
 // console.log('user', count_users)

  const admin_count = (await User.find({ role: "admin" }).count());
  //console.log('admin', admin_count)


  const patient_count = (await User.find({ role: "patient" }).count());
  //console.log('patient', patient_count)



  const hospitalscount = await Hospital.countDocuments({ approved: "true" });
 // console.log('hospcount', hospitalscount)
  const pharmaciescount = await Pharmacy.countDocuments({ approved: "true" });
  //console.log('pharmcount', pharmaciescount)
  const doctorscount = await doctor.countDocuments({ approved: "true" });
  //console.log('doccount', doctorscount)

  const pendinghosp = await Hospital.countDocuments({approved: "null"});
  //console.log('hosp', pendinghosp)
  const pendingpharm = await Pharmacy.countDocuments({approved: "null" });
  //console.log('p', pendingpharm)
  const pendingdoct = await doctor.countDocuments({approved: "null" });
 // console.log('doc', pendingdoct)

  const count_details = {
    user_count: count_users,
    admin_count: admin_count,
    patient_count: patient_count,
    hospitalscount: hospitalscount,
    pharmaciescount: pharmaciescount,
    doctorscount: doctorscount,
    pendinghosp: pendinghosp,
    pendingpharm: pendingpharm,
    pendingdoct: pendingdoct,
  }
  req.count_details = count_details;

  next();
}

exports.up_user_1 = async (req, res) => {
  //console.log(req.body)
  const { fullname, email } = req.body;
  if (!email || !fullname) {
    return res.json({
      status: "error",
      error: "Please enter email and name",
    });
  }

  let user = await User.findOne({ email, fullname });

 // console.log('usre', user)
  if (!user) {
    return res.json({
      status: "error",
      message: "Please enter a valid email or name",
    });
  }

  req.user = user[0];
  res.status(200).json({
    status: "success",
    message: "user found",
    user
  });
}

exports.updateUser = async (req, res) => {
  const { email, fullname, role } = req.body
  let user = await User.findOne({ email, fullname });
  const new_data = await User.findByIdAndUpdate(user._id, { role: role }, {
    // new: true,
    // runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    new_data,
  });
}