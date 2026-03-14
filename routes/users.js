const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { userSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsync");
const upload = require("../config/multerProfilePic");
const ExpressError = require("../utils/ExpressError");
const passport = require('passport');
const { SaveReturnTo, alreadyLoggedIn,validateUser } = require("../middleware.js");
const userControllers = require("../controllers/users.js")


// Show signup form
router.get("/signup", alreadyLoggedIn, (userControllers.getSignupForm));

// register new user
router.post("/signup", upload.single("profilePicture"), validateUser, wrapAsync(userControllers.postSignupnewUser));


router.get("/login",alreadyLoggedIn, (userControllers.getLoginpage));

router.post("/login",SaveReturnTo, passport.authenticate("local", {failureFlash: "Invalid Credentials",failureRedirect: "/login"}),
(userControllers.authenticatUser));

router.get("/logout", (userControllers.LogOutUser));



module.exports = router;