const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    img : String,
    title : String,
    description : String,
    date : String,
    cost : String,
})

module.exports = mongoose.model("data",userData);


