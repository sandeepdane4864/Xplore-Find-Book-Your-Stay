const Listing = require("../models/listing");
const Review = require("../models/review.js");
const fs = require("fs");


module.exports.indexcontroller = async (req, res) => {
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
};


module.exports.getNewlistingPage = (req, res) => { res.render("listings/new.ejs"); }

module.exports.PostNewlistingcontroller = async (req, res) => {


    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            filename: req.file.filename,
            url: "/uploads/listings/" + req.file.filename
        };
    }
    req.flash("success", "Listing created successfully!");
    await newListing.save();
    res.redirect("/listings");
};


module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const list = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                select: "username"
            }
        });

    if (!list) {
        req.flash("error", "Listing doesn't exist.");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { list });

};


module.exports.editListing = async (req, res) => {

    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing doesn't exist.");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });

};

module.exports.updateListing = async (req, res) => {

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
};

module.exports.deleteListing = async (req, res) => {
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
};


module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) throw new ExpressError(404, "Listing not found");
    const newReview = new Review(req.body.review);
    // set review author
    newReview.author = req.user._id;
    await newReview.save();
    // attach review to listing
    list.reviews.push(newReview._id);
    await list.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
        // $pull operator removes the reviewId from the reviews array in the listing document
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
};


module.exports.getCheckoutPage =async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    const { checkIn, checkOut, guests = 1 } = req.query;

    let nights = 0;
    let tax = 0;
    let total = 0;

    if (checkIn && checkOut) {

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (nights < 1) nights = 1;

        const subtotal = nights * listing.price;

        tax = Math.round(subtotal * 0.1);

        total = subtotal + tax;
    }

    res.render("bookings/checkout", {
        listing,
        checkIn,
        checkOut,
        guests,
        nights,
        tax,
        total
    });

};
