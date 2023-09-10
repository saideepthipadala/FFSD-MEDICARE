const { promisify } = require("util");
const User = require("./../models/user_model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const bcrypt = require("bcryptjs");
const { emit } = require("process");
const { decode } = require("punycode");
const user_model = require("./../models/contact_us");
const contact_us = require("./../models/contact_us");


exports.update_details = async(req, res) => {
  console.log("usercontroleer💥💥💥💥💥💥",req.body.password);
  console.log("email👋👋👋👋👋👋" , req.body.email);
  
  

  const decoded = jwt.verify(
    req.cookies.userRegistered,
    process.env.JWT_SECRET
  );
  

  // const spam_email = await User.find({email:req.body.email}).toArray(function(err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   db.close();
  // });
  // console.log('spam email 😤😤😤😤😤😤' , spam_email)
  // console.log('reg email 😤😤😤😤😤😤' , req.body._id)
  // if(spam_email){
  //   if(spam_email._id != req.body.id ){
  //     delete req.body.email;
  //   }

  // }

  if(req.body.password == undefined){

    // const pass = await User.findById(decoded.id);
    // req.password = pass.password;
  }
  else{
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

exports.send_data = async (req,res)=>{
  const newUser = await  contact_us.create(req.body);
  res.status(201).json({
    status: "success",

    data: {
      user: newUser,
    },

  });
}


