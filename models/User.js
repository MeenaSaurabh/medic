const mongoose = require("mongoose");

const plm = require("passport-local-mongoose");

const userModel = new mongoose.Schema({
    passwordResetToken: {
        type: Number,
        default: 0
    },
    username : {
        type : String,
        trim: true,
        unique: true,
        required: [true, 'Username field must not empty'],
        minLength: [4, "Username field must have atleast 4 characters"]
    },
    email : {
        type : String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },    
    password : {
        type : String
    } , 
    avatar: {
        type: String,
        default: "default.jpg",
    },
    todos : [{ type : mongoose.Schema.Types. ObjectId, ref:"data"}]
})

userModel.plugin(plm);

module.exports = mongoose.model('user',userModel);