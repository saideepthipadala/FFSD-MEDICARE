const mongoose = require("mongoose")
const appointment_schema = require("./appointment_schema");
const feedback_schema = require('./doctorfeedback');

const doctor_schema = new mongoose.Schema({
    name: String,
    gender: String,
    specialization: String,
    qualification: String,
    email: String,
    password: String,
    // _id: String,
    approved: { type: String, default:"null" },
    appointments: [appointment_schema],
    feedbacks: [feedback_schema],
    registrationType: { type: String, default: "Doctor" },
    feedback: [String],

});

const doctor = mongoose.model('doctor', doctor_schema);
module.exports = doctor;