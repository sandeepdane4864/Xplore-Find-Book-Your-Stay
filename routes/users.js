const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const { userSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const upload = require("../config/multerProfilePic.js");


function validateUser(req, res, next) {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
}

router.get("/login", (req, res) => {
    res.render("listings/login.ejs");
});

// Register page
router.get("/register", (req, res) => {
    res.render("listings/register.ejs");
});

router.post("/register",upload.single("profilePicture"),
    wrapAsync(async (req, res) => {

        const newUser = new User(req.body.user);

        if (req.file) {
            newUser.profilePicture = {
                filename: req.file.filename,
                url: "/uploads/profilePictures/" + req.file.filename
            };
        }

        await newUser.save();

        res.redirect("/login");
    })
);

module.exports = router;