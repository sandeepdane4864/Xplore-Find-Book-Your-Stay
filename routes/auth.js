const express = require("express");
const router = express.Router();
const passport = require("passport");

// Login
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
router.get("/google/callback",
    passport.authenticate("google", {
        successRedirect: "/listings",
        failureRedirect: "/login"
    })
);

module.exports = router;