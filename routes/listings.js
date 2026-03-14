const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const upload = require("../config/multerListing.js");
// fs is used to delete the image file from the server when a listing is deleted fs is file system
const { IsloggedIn, SaveReturnTo, isOwner,isReviewAuthor,validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const Listing = require("../models/listing.js")



router.get("/", wrapAsync( listingControllers.indexcontroller ));

// New form
router.get("/new", SaveReturnTo, IsloggedIn, (listingControllers.getNewlistingPage));

// Create listing
router.post("/", IsloggedIn, upload.single("image"), validateListing,wrapAsync(listingControllers.PostNewlistingcontroller));

router.get("/my-listings",SaveReturnTo, IsloggedIn, async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id }).populate("owner");;
    res.render("listings/my-listings", { listings });
});

// Show single listing
router.get("/:id", wrapAsync(listingControllers.showListing));

// Edit form
router.get("/:id/edit", SaveReturnTo, IsloggedIn, isOwner, wrapAsync(listingControllers.editListing));

// Update listing
router.put("/:id", SaveReturnTo, IsloggedIn, isOwner, upload.single("image"), validateListing,wrapAsync(listingControllers.updateListing));

// delete listing  and also assosiated image file

router.delete("/:id", SaveReturnTo, IsloggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

// Add review
router.post("/:id/reviews", IsloggedIn, wrapAsync(listingControllers.addReview));

// Delete review
router.delete("/:id/reviews/:reviewId", IsloggedIn, isReviewAuthor, wrapAsync(listingControllers.deleteReview));


//router.get("/:id/checkout", async (req, res) => {

   // const listing = await Listing.findById(req.params.id);

    //const checkIn = req.query.checkIn;
   // const checkOut = req.query.checkOut;
  //  const guests = req.query.guests || 1;

   // const nights = 2;
   // const tax = 239;
   // const total = (nights * listing.price) + tax;

 //   res.render("bookings/checkout", {
  ////      listing,
   //     checkIn,
    //    checkOut,
   //     guests,
     //   nights,
     //   tax,
    //    total
  //  });

//});
router.get("/:id/checkout", IsloggedIn, SaveReturnTo, wrapAsync(listingControllers.getCheckoutPage));


module.exports = router;