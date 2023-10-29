const mongoose = require("mongoose")


const hospitalSchema = new mongoose.Schema({
    name: String,
    location: String,
    contactNumber: Number,
    email: String,
    noOfDoctors: Number,
    approved: { type: String, default:"null"},
    registrationType: { type: String, default: "Hospital" },
});

const Hospital = mongoose.model("HospitalDetails", hospitalSchema);

module.exports = Hospital;
