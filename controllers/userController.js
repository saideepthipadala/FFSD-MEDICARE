const User = require("./../models/user_model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const bcrypt = require("bcryptjs");
const doctor = require("./../models/doctor")


exports.update_details = async (req, res) => {

  const decoded = jwt.verify(
    req.cookies.userRegistered,
    process.env.JWT_SECRET
  );



  if (req.body.password == undefined) {

    // const pass = await User.findById(decoded.id);
    // req.password = pass.password;
  }
  else {
    const pass = await bcrypt.hash(req.body.password, 12);
    req.body.password = pass;

  }


  const new_data = await User.findByIdAndUpdate(decoded.id, req.body, {
    // new: true,
    // runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    new_data,
  });


}

exports.send_data = async (req, res) => {
  const newUser = await contact_us.create(req.body);
  res.status(201).json({
    status: "success",

    data: {
      user: newUser,
    },

  });
}


///////////////////////////////////////////////
exports.send_feedback = async (req, res) => {
  const { fullname: name, email, message: feedback } = req.body;
  const newUser = await doctor.find({ "name": name, "email": email });
 // console.log(newUser);
  if (newUser.length > 0) {

    await doctor.findOneAndUpdate({ "name": name, "email": email }, { "$addToSet": { feedback: feedback } });

    res.status(201).json({
      status: "success",
    });


  }
  else {
    res.status(200).json({
      status: "error",
    })
  }
};



