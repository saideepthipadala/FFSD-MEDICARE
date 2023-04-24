const { promisify } = require("util");
const User = require("./../models/user_model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const bcrypt = require("bcryptjs");
const { emit } = require("process");
const { decode } = require("punycode");
const Hospital = require("./../models/Hospital");
const Pharmacy = require("./../models/Pharmacy");
const doctor = require("./../models/doctor");





exports.dashboard_details = async (req, res, next) => {

  const decoded = jwt.verify(
    req.cookies.userRegistered,
    process.env.JWT_SECRET
  );

  const count_users = (await User.find().count());
  console.log('user', count_users)

  const admin_count = (await User.find({ role: "admin" }).count());
  console.log('admin', admin_count)


  const patient_count = (await User.find({ role: "patient" }).count());
  console.log('admin', patient_count)
  
    
  
  const hospitalscount = await Hospital.countDocuments({ approved: "true" });
  const pharmaciescount = await Pharmacy.countDocuments({ approved: "true" });
  const doctorscount = await doctor.countDocuments({ approved: "true" });
  const pendinghosp = await Hospital.countDocuments({ approved: "null" });
  const pendingpharm = await Pharmacy.countDocuments({ approved: "null" });
  const pendingdoct = await doctor.countDocuments({ approved: "null" });

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
  console.log(req.body)
  const { fullname, email } = req.body;
  if (!email || !fullname) {
    return res.json({
      status: "error",
      error: "Please enter email and name",
    });
  }

  let user = await User.findOne({ email, fullname });

  console.log('usre', user)
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

exports.updateUser = (req, res) => {
  const body = req.body
  console.log(body)
  res.sendStatus(200)
}