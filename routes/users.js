const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const crypto = require("crypto");

const wrapAsync = require("../utils/wrapAsync");
const upload = require("../config/multerProfilePic");
const passport = require("passport");

const { userSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

const { SaveReturnTo, alreadyLoggedIn, validateUser } = require("../middleware.js");

const userControllers = require("../controllers/users.js");

const transporter = require("../utils/mailer");

// Show signup form
router.get("/signup", alreadyLoggedIn, userControllers.getSignupForm);

// Register new user
router.post("/signup", upload.single("profilePicture"), validateUser,
    wrapAsync(userControllers.postSignupnewUser)
);

// Show forgot password page
router.get("/forgot-password", (req, res) => {
    res.render("users/forgot");
});

// Handle forgot password
router.post("/forgot-password", wrapAsync(userControllers.PostfogotPass));

// Show reset page
router.get("/reset-password/:token", wrapAsync(userControllers.GetresetPage));

// Handle reset password
router.post("/reset-password/:token", wrapAsync(userControllers.PostResetpassPage));


// Show login page
router.get("/login", alreadyLoggedIn, userControllers.getLoginpage);


// Authenticate login
router.post("/login",SaveReturnTo,
    passport.authenticate("local", {
        failureFlash: "Invalid Credentials",
        failureRedirect: "/login"
    }),
    userControllers.authenticatUser
);

router.get("/settings", (req,res)=>{
    res.render("users/settings.ejs")
});

router.get("/logout", userControllers.LogOutUser);


module.exports = router;