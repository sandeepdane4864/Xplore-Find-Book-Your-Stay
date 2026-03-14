const { userSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.IsloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // redirect 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login first ! ");
        return res.redirect("/login");
    }
    next();
}

// middleware to prevent logged in users from accessing login and register pages when they are already logged in acress via url

module.exports.alreadyLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in!");
        return res.redirect("/");
    }
    next();
}

module.exports.SaveReturnTo = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


const Listing = require("./models/listing");

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

const Review = require("./models/review");

module.exports.isReviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${id}`);
    }

    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};


module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};