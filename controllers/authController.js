const { promisify } = require("util");
const User = require("./../models/user_model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const bcrypt = require("bcryptjs");
const { emit } = require("process");
const { decode } = require("punycode");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  // console.log(req.body);
  const email_exist = await User.find({ email: req.body.email });
  // console.log(email_exist);

  if (email_exist.length) {
    return res.json({
      status: "error",
      error: "User with this email has already been registered",
    });
  }
  const newUser = await User.create(req.body);

  const token = await signToken(newUser._id);
  const cookieOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN,
    httpOnly: true,
  };

  res.cookie("userRegistered", token, cookieOptions);
  req.user = newUser;

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
    success: "User has been successfully logged in.",
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      status: "error",
      error: "Please enter email and password",
    });
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.json({
      status: "error",
      error: "Please enter a valid email or password",
    });
  }
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN,
    httpOnly: true,
  };
  res.cookie("userRegistered", token, cookieOptions);
  req.user = user;
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
    success: "User has been successfully logged in.",
  });
};

exports.loggedIn = async (req, res, next) => {
  if (!req.cookies.userRegistered) return next();

  const decoded = jwt.verify(
    req.cookies.userRegistered,
    process.env.JWT_SECRET
  );
  // console.log("decoded", decoded);

  const user_exist = await User.findById(decoded.id);
  // const spam_email = await User
  // console.log("user_e", user_exist);
  if (user_exist) {
    req.user = user_exist;
  }
  // console.log("dcjskdclsdjkcosdc", req.user);
  next();
};

exports.logout = (req, res) => {
  res.clearCookie("userRegistered");
  req.user = undefined;
  res.redirect("/");
};
