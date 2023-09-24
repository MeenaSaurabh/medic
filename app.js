// git init
// git add .
// git commit -m "first commit"
// git branch -M master
// git remote add origin https://github.com/MeenaSaurabh/medic.git
// git push -u origin master

const express = require("express");
const app = express();

const passport = require("passport");
const session = require("express-session");
const User = require("./models/User");

require("./models/db");

const indexRoute = require("./routes/index");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static((__dirname + '/public')));

app.use(
    session({
        saveUninitialized: false,
        resave: false,
        secret: "asdfg"
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoute);

app.listen(3000, () => {
    console.log("Server running at 3000");
})