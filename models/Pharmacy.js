const mongoose = require("mongoose")
const express = require("express");
const pharmacySchema = new mongoose.Schema({
    name: String,
    location: String,
    contactNumber: Number,
    email: String,
    noOfEmployees: Number,
    medicines: Array,
    approved: { type: String, default: "null" },
    registrationType: { type: String, default: "Pharmacy" },
});
const Pharmacy = mongoose.model("PharmacyDetails", pharmacySchema);

module.exports = Pharmacy;