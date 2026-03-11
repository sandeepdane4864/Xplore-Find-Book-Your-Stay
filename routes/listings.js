const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const upload = require("../config/multerListing.js");

// fs is used to delete the image file from the server when a listing is deleted fs is file system
const fs = require("fs");
const { IsloggedIn } = require("../middleware.js");
const passport = require('passport');

// VALIDATION
function validateListing(req, res, next) {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
}

router.get("/", wrapAsync(
    async (req, res) => {
        let { page = 1, category } = req.query;

        page = parseInt(page);
        const limit = 12;
        const skip = (page - 1) * limit;

        let filter = {};

        // Category Filter
        if (category && category !== "all") {
            filter.category = category;
        }

        const totalListings = await Listing.countDocuments(filter);
        const totalPages = Math.ceil(totalListings / limit);

        const all_listings = await Listing.find(filter)
            .skip(skip)
            .limit(limit);

        res.render("listings/index", {
            all_listings,
            currentPage: page,
            totalPages,
            selectedCategory: category || "all",
        });
    }));

// Show all listings
// router.get("/", wrapAsync(async (req, res) => {

//     let page = parseInt(req.query.page) || 1;
//     let limit = 12;

//     const totalListings = await Listing.countDocuments({});
//     const totalPages = Math.ceil(totalListings / limit);

//     const all_listings = await Listing.find({})
//         .skip((page - 1) * limit)
//         .limit(limit);

//     res.render("listings/index.ejs", {all_listings,currentPage: page,totalPages});

// }));



// New form
router.get("/new", IsloggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Create listing
router.post("/", IsloggedIn, upload.single("image"), validateListing,
    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body.listing);

        if (req.file) {
            newListing.image = {
                filename: req.file.filename,
                url: "/uploads/listings/" + req.file.filename
            };
        }
        req.flash("success", "Listing created successfully!");
        await newListing.save();
        res.redirect("/listings");
    })
);

// Show single listing
router.get("/:id", wrapAsync(async (req, res) => {

    const { id } = req.params;
    const list = await Listing.findById(id).populate("reviews");
    if (!list) {
        req.flash("error", "Listing doesn't exist.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });

}));

// Edit form
router.get("/:id/edit", IsloggedIn, wrapAsync(async (req, res) => {

    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing doesn't exist.");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });

}));

// Update listing
router.put("/:id", IsloggedIn, upload.single("image"), validateListing,
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });

        if (req.file) {
            updatedListing.image = {
                filename: req.file.filename,
                url: "/uploads/listings/" + req.file.filename
            };

            await updatedListing.save();
        }
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    })
);

// delete listing  and also assosiated image file

router.delete("/:id", IsloggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing) {
        if (deletedListing.image && deletedListing.image.filename) {
            const imagePath = `uploads/listings/${deletedListing.image.filename
                }`;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                } else {
                    console.log("Image file deleted successfully.");
                }
            });
        }
        req.flash("success", "Listing deleted successfully!");
    } else {
        req.flash("error", "Listing not found.");
    }
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
    req.flash("success", "Review added successfully!");
    await list.save();
    res.redirect(`/listings/${id}`);
}));

// Delete review
router.delete("/:id/reviews/:reviewId", IsloggedIn, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
        // $pull operator removes the reviewId from the reviews array in the listing document
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
}));


router.get("/:id/checkout", async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    const checkIn = req.query.checkIn;
    const checkOut = req.query.checkOut;
    const guests = req.query.guests || 1;

    const nights = 2;
    const tax = 239;
    const total = (nights * listing.price) + tax;

    res.render("bookings/checkout", {
        listing,
        checkIn,
        checkOut,
        guests,
        nights,
        tax,
        total
    });

});


module.exports = router;