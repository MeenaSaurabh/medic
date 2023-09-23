const express = require("express");
const router = express.Router();

const test = require("../models/User");
const userModel = require("../models/userModel");

const passport = require("passport");
const localStrategy = require("passport-local");
const { sendmail } = require("../utils/mail");

passport.use(new localStrategy(test.authenticate()));


router.get("/", (req, res) => {
    res.render("index", { title: "Home", user: req.user })
});

router.get("/signup", (req, res) => {
    res.render("signup", { title: "Sign-Up", user: req.user })
})
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new test({ username, email });
        await test.register(newUser, password);
        res.redirect("/signin")
    } catch (error) {
        res.send(error)
    }
})

router.get("/signin", (req, res) => {
    res.render("signin", { title: "Sign-In", user: req.user })
})
router.post("/signin",
    passport.authenticate("local", {
        failureRedirect: "/signin",
        successRedirect: "/task"
    }),
    async (req, res) => {
        // try {
        //     const {username, password} = req.body;
        //     const user = await test.findOne({ username });
        //     if(user === null){
        //         return res.send(`User not found. <a href="/signin">Sign-In</a>`)
        //     }
        //     if (user.password !== password) {
        //         return res.send(`Incorrect Password. <a href="/signin">Sign-In</a>`)
        //     }
        // res.redirect("/task")
        // } catch (error) {
        //     res.send(error);
        // }
    }
);

router.get("/forgetpassword", (req, res) => {
    res.render("forgetpassword", { title: "Forget Password", user: req.user })
})
router.post("/forgetpassword", async (req, res) => {
    try {
        const currentEmail = await test.findOne({ email: req.body.email })
        if (currentEmail === null) { // searching for user of currentEmail
            return res.send(`Email not found, <a href= "/forgetpassword">Enter again</a>`)
        }
        sendmail(req, res, currentEmail);
        // res.redirect("/changepassword/" + currentEmail._id ); // for old method
    } catch (error) {
        res.send(error);
    }
})

router.get("/changepassword/:id", (req, res, next) => {
    res.render("changepassword", { title: "Change Password", id: req.params.id, user: null })
})
router.post("/changepassword/:id", async (req, res, next) => {
    try {
        const user = await test.findById(req.params.id);

        if (user.passwordResetToken === 1) {
            await user.setPassword(req.body.password);
            user.passwordResetToken === 0;
        } else {
            res.send(`Link expired try again <a href="/forgetpassword">Forget Password</a>`)
        }
        
        await user.save();
        res.redirect("/signin")
    } catch (error) {
        res.send(error);
    }
})

router.get("/reset/:id", isLoggedIn, (req, res) => {
    res.render("reset", { title: "Reset Password", id: req.params.id, user: req.user })
})
router.post("/reset/:id", async (req, res) => {
    try {
        await req.user.changePassword(req.body.oldpassword, req.body.password);
        await req.user.save();
        res.redirect("/signin");
    } catch (error) {
        res.send(error);
    }
})

// TO-DO LIST
router.get("/add", (req, res) => {
    res.render("add", { title: "Add Medicine" })
});
router.post("/add", async (req, res) => {
    try { //same as old Signup method
        const newTask = new userModel(req.body);
        await newTask.save();
        res.redirect("/task")
    } catch (error) {
        res.send(error);
    }
})

router.get("/task", isLoggedIn, async (req, res) => {
    try {
        const allTasks = await userModel.find();
        res.render("task", { title: "Dashboard", allTasks, user: req.user })
    } catch (error) {
        res.send(error);
    }
});

router.get("/signout", isLoggedIn, (req, res, next) => {
    req.logOut(() => {
        res.redirect("/signin")
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/signin");
}


router.get("/update/:id", async (req, res) => {
    try {
        const currentTask = await userModel.findById(req.params.id);
        res.render("updatetask", { title: "Update medicine", currentTask })
    } catch (error) {
        res.send(error)
    }
});
router.post("/update/:id", async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/task")
    } catch (error) {
        res.send(error);
    }
})

router.get("/delete/:id", async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.redirect("/task")
    } catch (error) {
        res.send(error)
    }
});



module.exports = router;