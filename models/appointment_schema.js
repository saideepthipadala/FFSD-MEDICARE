const mongoose = require("mongoose")
const express = require("express");



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
const appointment = mongoose.model('appointmentDetails', appointment_schema);
module.exports =appointment_schema;