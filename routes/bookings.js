const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

const { IsloggedIn, SaveReturnTo} = require("../middleware.js");
const BookingController = require("../controllers/Bookings.js")




router.post("/create-checkout-session/:id", IsloggedIn,SaveReturnTo, wrapAsync(BookingController.CreateCheckoutSession));


router.get("/success", IsloggedIn, (req, res) => {

    res.render("bookings/success.ejs");

});

router.get("/cancel", IsloggedIn, (req, res) => {

    res.render("bookings/cancel.ejs");

});



module.exports = router;