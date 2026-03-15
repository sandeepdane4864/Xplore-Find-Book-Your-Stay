const Listing = require("../models/listing");
const Review = require("../models/review.js");
const { cloudinary } = require("../config/cloudinary");
const ExpressError = require("../utils/ExpressError");


module.exports.indexcontroller = async (req, res) => {
    let { page = 1, category, q } = req.query;

    page = parseInt(page);
    const limit = 12;
    const skip = (page - 1) * limit;

    let filter = {};

    // Category Filter
    if (category && category !== "all") {
        filter.category = category;
    }

    // Search Filter
    if (q && q.trim() !== "") {
        const searchRegex = new RegExp(q.trim(), "i"); // case-insensitive
        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
        ];
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
        searchQuery: q || "", // so you can keep the search box filled
    });
};

module.exports.getNewlistingPage = (req, res) => { res.render("listings/new.ejs"); }

module.exports.PostNewlistingcontroller = async (req, res) => {


    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            filename: req.file.filename,
            url: req.file.path || req.file.secure_url || req.file.url
        };
    }
    req.flash("success", "Listing created successfully!");
    await newListing.save();
    res.redirect("/listings");
};
module.exports.GetmylistingsPage = async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id }).populate("owner");;
    res.render("listings/my-listings", { listings });
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

    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // update text fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;
    listing.category = req.body.listing.category;

    if (req.file) {
        // delete old image
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        };

        // save new image
        listing.image = {
            filename: req.file.filename,
            url: req.file.path || req.file.secure_url || req.file.url
        };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
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


module.exports.getCheckoutPage = async (req, res) => {

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


