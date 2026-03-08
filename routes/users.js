const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { userSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsync");
const upload = require("../config/multerProfilePic");
const ExpressError = require("../utils/ExpressError");
const passport = require('passport');
const { IsloggedIn, SaveReturnTo } = require("../middleware.js");

// VALIDATION
function validateUser(req, res, next) {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
}

// Show signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs", { errors: {}, old: {} });
});

// register new user
router.post("/signup", upload.single("profilePicture"), validateUser, wrapAsync(async (req, res) => {
    try {
        const newUser = new User(req.body.user);
        if (req.file) {
            newUser.profilePicture = {
                filename: req.file.filename,
                url: "/uploads/users/" + req.file.filename
            };
        }
        await User.register(newUser, req.body.user.password);
        req.login(newUser, (err) => {
            if (err) {
                console.log("Error during auto-login after registration:", err);
                req.flash("error", "An error occurred during login. Please try logging in manually.");
                return res.redirect("/login");
            }else {
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
}));


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",SaveReturnTo, passport.authenticate("local", {failureFlash: "Invalid Credentials",failureRedirect: "/login"}),
async (req, res) => {
    req.flash("success", "Welcome back, " + req.user.username + "!");
    Orignialurl = req.session.returnTo || "/listings";
    res.redirect(Orignialurl);
});

router.get("/logout", (req, res) => {
    req.logout( (err) => {
        if (err) { 
            console.log("Error during logout:", err);
            req.flash("error", "An error occurred while logging out. Please try again.");
            return res.redirect("/listings");
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
});

module.exports = router;