const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/Bookings.js");
const { IsloggedIn, SaveReturnTo } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// My Bookings Page
router.get("/bookings/mybookings", IsloggedIn, wrapAsync(BookingController.getMyBookings));

// Checkout Page & Create Stripe Session
router.route("/create-checkout-session/:id")
.get(IsloggedIn, wrapAsync(BookingController.CreateCheckoutSession))
.post(IsloggedIn, wrapAsync(BookingController.CreateCheckoutSession));

// Payment Success
router.get("/payment/success", IsloggedIn, wrapAsync(BookingController.Successpage));

// Payment Cancel
router.get("/payment/cancel", IsloggedIn, (BookingController.PaymentCancelpage));

module.exports = router;