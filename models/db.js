const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://saurabh:saurabh123@cluster0.tfqhqzq.mongodb.net/")
.then( ()=> console.log("db connected"))
.catch( ()=> console.log(Error))

// saurabh123