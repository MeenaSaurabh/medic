const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    img : String,
    title : String,
    description : String,
    date : String,
    cost : String,
    user : {type: mongoose.Schema.Types.ObjectId , ref: "user"}
})

module.exports = mongoose.model("data",userData);


