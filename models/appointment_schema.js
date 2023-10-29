const mongoose = require("mongoose")
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
module.exports =appointment_schema;