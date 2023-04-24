const mongoose = require("mongoose");
const validator = require("validator");
const query_data = mongoose.Schema({
    fullname : {
        type:String,
    
    },
    email:{
        type:String,
    },
    message:{
        type:String,
    }
})

const contact_query = mongoose.model("contact_query",query_data);
module.exports = contact_query;