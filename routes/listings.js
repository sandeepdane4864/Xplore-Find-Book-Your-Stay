const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const upload = require("../config/multerListing.js");

// VALIDATION
function validateListing(req, res, next) {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
}

// Show all listings
router.get("/", wrapAsync(async (req, res) => {
    const all_listings = await Listing.find({});
    res.render("listings/index.ejs", { all_listings });
}));

// New form
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create listing
router.post(
    "/",
    upload.single("image"),
    validateListing,
    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body.listing);

        if (req.file) {
            newListing.image = {
                filename: req.file.filename,
                url: "/uploads/listings/" + req.file.filename
            };
        }

        await newListing.save();
        res.redirect("/listings");
    })
);

// Show single listing
router.get("/:id", wrapAsync(async (req, res) => {

    const { id } = req.params;
    const list = await Listing.findById(id).populate("reviews");
    if (!list) throw new ExpressError(404, "Listing not found");
    res.render("listings/show.ejs", { list });

}));

// Edit form
router.get("/:id/edit", wrapAsync(async (req, res) => {

    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) throw new ExpressError(404, "Listing not found");
    res.render("listings/edit.ejs", { list });

}));

// Update listing
router.put("/:id", upload.single("image"),validateListing,
wrapAsync(async (req, res) => {

        const { id } = req.params;

        let updatedListing = await Listing.findByIdAndUpdate( id,req.body.listing,{ runValidators: true, new: true });

        if (req.file) {
            updatedListing.image = {
                filename: req.file.filename,
                url: "/uploads/listings/" + req.file.filename
            };

            await updatedListing.save();
        }

        res.redirect(`/listings/${id}`);
    })
);

// Delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Add review
router.post("/:id/reviews", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) throw new ExpressError(404, "Listing not found");
    const newReview = new Review(req.body.review);
    await newReview.save();
    list.reviews.push(newReview._id);
    await list.save();
    res.redirect(`/listings/${id}`);
}));

// Delete review
router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
        // $pull operator removes the reviewId from the reviews array in the listing document
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;