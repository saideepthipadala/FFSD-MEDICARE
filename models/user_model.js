const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, "Please provide a valid email"],
  },
  address : String,
  phone_num_1 : Number,
  phone_num_2 : Number,
  password: {
    type: String,
    // required: [true, "Please provide a password"],
    // minlength: 8,
    // select: false,
  },
  gender: {
    type: String,
    enum: {
      values: ["Male", "Female", "Others"],
    },
  },
  age: {
    type: Number,
    min: [1, "The minimum age should be 1"],
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "patient", "doctor"],
    },
    default: "user",
  },
  // confirm_password: {
  //   type: String,
  //   required: [true, "Please confirm your password"],
  //   validate: {
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //   },
  //   message: "Password are not the same",
  //   select: false,
  // },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;

 
  next();
});

userSchema.methods.correctPassword = async function (
  candidatrPassword,
  userPassword
) {
  return await bcryptjs.compare(candidatrPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
