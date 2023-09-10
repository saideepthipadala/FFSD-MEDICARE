const mongoose = require("mongoose")

const feedback_schema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    toDoctor: { type: String, required: true }
});


module.exports = feedback_schema;