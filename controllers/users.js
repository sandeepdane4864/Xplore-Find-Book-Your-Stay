const User = require("../models/user");

module.exports.getSignupForm = (req, res) => {
    res.render("users/signup.ejs", { errors: {}, old: {} });
};

module.exports.postSignupnewUser = async (req, res) => {
    try {
        const newUser = new User(req.body.user);
        if (req.file) {
            newUser.profilePicture = {
                filename: req.file.filename,
                url: "/uploads/profilePictures/" + req.file.filename
            };
        }
        await User.register(newUser, req.body.user.password);
        req.login(newUser, (err) => {
            if (err) {
                console.log("Error during auto-login after registration:", err);
                req.flash("error", "An error occurred during login. Please try logging in manually.");
                return res.redirect("/login");
            } else {
                req.flash("success", "Welcome, " + newUser.username + "! Your account has been created successfully.");
                return res.redirect("/listings");
            }

        });

    } catch (e) {


        if (e.code === 11000) {
            req.flash("error", "email already exists");
            res.redirect("/signup");
        }
        if (e.code === 11000 && e.keyPattern && e.keyPattern.username) {
            req.flash("error", "username already exists");
            res.redirect("/signup");
        }
    }
};

module.exports.getLoginpage = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.authenticatUser = async (req, res) => {
    req.flash("success", "Welcome back, " + req.user.username + "!");
    Orignialurl = res.locals.redirectUrl || "/listings";
    res.redirect(Orignialurl);
}

module.exports.LogOutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("Error during logout:", err);
            req.flash("error", "An error occurred while logging out. Please try again.");
            return res.redirect("/listings");
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
}

module.exports.PostResetpassPage = async (req, res) => {

    const user = await User.findOne({

        resetToken: req.params.token,
        resetTokenExpire: { $gt: Date.now() }

    });

    if (!user) {
        req.flash("error", "Password reset token is invalid or expired.");
        return res.redirect("/forgot-password");
    }


    // set new password
    await user.setPassword(req.body.password);

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    req.flash("success", "Password reset successful. You can now login.");

    res.redirect("/login");

};


module.exports.GetresetPage = async (req, res) => {

    const user = await User.findOne({

        resetToken: req.params.token,
        resetTokenExpire: { $gt: Date.now() }


    });
    console.log("Token from URL:", req.params.token);
    console.log("Looking for user:", await User.find({ resetToken: req.params.token }));

    if (!user) {
        req.flash("error", "Password reset token is invalid or expired.");
        return res.redirect("/forgot-password");
    }

    res.render("users/reset", { token: req.params.token });

};


module.exports.PostfogotPass = async (req, res) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        req.flash("error", "No account with that email found");
        return res.redirect("/forgot-password");
    }


    // generate reset token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour

    try {
        await user.save();
        console.log("Reset token saved:", user.resetToken);
    } catch (err) {
        console.error("Error saving reset token:", err);
    }


    // reset link
    const resetLink = `http://localhost:3000/reset-password/${token}`;


    // send email
    const sendMail = require("../utils/mailer"); // your SendGrid mailer

    await sendMail(
        user.email,
        "Password Reset - Xplore",
        `
    <h2>Password Reset</h2>
    <p>Hello ${user.firstName},</p>
    <p>You requested a password reset for your Xplore account.</p>
    <p>Click the button below to reset your password:</p>
    <a href="${resetLink}" 
      style="display:inline-block;padding:10px 18px;background:#dc3545;color:white;text-decoration:none;border-radius:5px;">
      Reset Password
    </a>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request this, please ignore this email.</p>
    `
    );


    req.flash("success", "Password reset link sent to your email.");
    res.redirect("/login");

};
