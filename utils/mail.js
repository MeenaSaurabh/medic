const nodemailer = require("nodemailer");

exports.sendmail = function (req, res, user) {
    const pageurl = req.protocol + "://" + req.get("host") + "/changepassword/" + user._id;

    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "soru2024@gmail.com",
            pass: "mtrgowkngfscxmxc" // mail-manageAcc-2stepVerf-security-appPassw
        }
    });

    const mailOptions = {
        from: "Saurabh Pvt.Ltd.<soru2024@gmail.com>",
        to: req.body.email,
        subject: "Password Reset Link",
        text: "Do not share this Link to anyone.",
        html: `<a href=${pageurl}>Password Reset Link</a>` // set Token = '1' just after clicking LINK
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) return res.send(err);
        console.log(info);
        user.paswordResetToken = 1; // set it '1' just after clicking LINK
        user.save();
        return res.send("<h1 style='text-align:center;color: tomato; margin-top:10%'><span style='font-size:60px;'>✔️</span> <br />Email Sent! Check your inbox , <br/>check spam in case not found in inbox.</h1>")
    })
}