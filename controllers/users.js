const User = require("../models/user");
const crypto = require("crypto");
const sendMail = require("../utils/mailer");

// SIGNUP 
module.exports.getSignupForm = (req, res) => {
    res.render("users/signup.ejs", { errors: {}, old: {} });
};

module.exports.postSignupnewUser = async (req, res) => {
    try {
        const newUser = new User(req.body.user);

        if (req.file) {
            newUser.profilePicture = {
                filename: req.file.filename,
                url: req.file.path || req.file.secure_url || req.file.url
            };
        }

        await User.register(newUser, req.body.user.password);

        req.login(newUser, (err) => {
            if (err) {
                console.error("Login after signup error:", err);
                req.flash("error", "Error during login. Please login manually.");
                return res.redirect("/login");
            }
            req.flash("success", `Welcome, ${newUser.username}!`);
            return res.redirect("/listings");
        });
    } catch (e) {
        console.error("Signup error:", e);
        if (e.code === 11000) {
            if (e.keyPattern?.email) req.flash("error", "Email already exists");
            if (e.keyPattern?.username) req.flash("error", "Username already exists");
            return res.redirect("/signup");
        }
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/signup");
    }
};

// ---------------- LOGIN ----------------
module.exports.getLoginpage = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.authenticatUser = async (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.LogOutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            req.flash("error", "Error logging out. Try again.");
            return res.redirect("/listings");
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
};

//  FORGOT PASSWORD 
module.exports.PostfogotPass = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            req.flash("error", "No account with that email found");
            return res.redirect("/forgot-password");
        }

        // generate secure token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 3600000; // 1 hour
        await user.save();

        console.log("Reset token saved:", user.resetToken, user.resetTokenExpire);

        // encode token for URL safety
        const resetLink = `http://localhost:8080/reset-password/${encodeURIComponent(token)}`;

        // send reset email
        await sendMail(
            user.email,
            "Password Reset - Xplore",
            `
            <h2>Password Reset</h2>
            <p>Hello ${user.firstName || user.username},</p>
            <p>You requested a password reset for your Xplore account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" 
              style="display:inline-block;padding:10px 18px;background:#dc3545;color:white;text-decoration:none;border-radius:5px;">
              Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, ignore this email.</p>
            `
        );

        req.flash("success", "Password reset link sent to your email.");
        res.redirect("/login");

    } catch (err) {
        console.error("Error in forgot password:", err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/forgot-password");
    }
};

// RESET PASSWORD PAGE 
module.exports.GetresetPage = async (req, res) => {
    const token = req.params.token;
    console.log("Token from URL:", token);

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }
    });

    console.log("User found for token:", user);

    if (!user) {
        req.flash("error", "Password reset token is invalid or expired.");
        return res.redirect("/forgot-password");
    }

    res.render("users/reset", { token });
};

// RESET PASSWORD POST 
module.exports.PostResetpassPage = async (req, res) => {
    const token = req.params.token;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        req.flash("error", "Password reset token is invalid or expired.");
        return res.redirect("/forgot-password");
    }

    // Update password using Passport-Local-Mongoose
    await user.setPassword(req.body.password);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    req.flash("success", "Password reset successful. You can now login.");
    res.redirect("/login");
};