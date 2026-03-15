const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const upload = require("../config/multerListing.js");
// fs is used to delete the image file from the server when a listing is deleted fs is file system
const { IsloggedIn, SaveReturnTo, isOwner, isReviewAuthor, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const Listing = require("../models/listing.js")


router.route("/")
  // get index page 
  .get(wrapAsync(listingControllers.indexcontroller))
  // Create listing
  .post(IsloggedIn, upload.single("image"), validateListing, wrapAsync(listingControllers.PostNewlistingcontroller))

// New form
router.get("/new", SaveReturnTo, IsloggedIn, (listingControllers.getNewlistingPage));
//mylistings page 
router.get("/my-listings", SaveReturnTo, IsloggedIn, (listingControllers.GetmylistingsPage));

// Show single listing
router.route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  // Update listing
  .put(SaveReturnTo, IsloggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingControllers.updateListing))
  // delete listing  and also assosiated image file
  .delete(SaveReturnTo, IsloggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

// Edit form
router.get("/:id/edit", SaveReturnTo, IsloggedIn, isOwner, wrapAsync(listingControllers.editListing));

// Add review
router.post("/:id/reviews", IsloggedIn, wrapAsync(listingControllers.addReview));

// Delete review
router.delete("/:id/reviews/:reviewId", IsloggedIn, isReviewAuthor, wrapAsync(listingControllers.deleteReview));

router.get("/:id/checkout", IsloggedIn, SaveReturnTo, wrapAsync(listingControllers.getCheckoutPage));


module.exports = router;