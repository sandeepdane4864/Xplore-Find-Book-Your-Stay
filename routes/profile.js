const express = require("express");
const router = express.Router({ mergeParams: true });
const { userSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsync");
const upload = require("../config/multerProfilePic");
const ExpressError = require("../utils/ExpressError");
const passport = require('passport');
const User = require("../models/user");
const { IsloggedIn } = require("../middleware.js");
const profileController = require("../controllers/profile.js")

// Profile Page
router.get("/", IsloggedIn,(profileController.getProfilePage) );

router.get("/edit", IsloggedIn,(profileController.getEditProfilepage) );

router.put("/edit", IsloggedIn, upload.single("profilePicture"),(profileController.editProfiledetails) );


module.exports = router;