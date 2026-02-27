// ENV CONFIG
require("dotenv").config();


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing");
const { listingSchema } = require("./schema.js");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

//  DATABASE CONNECTION 
const mongo_URL = process.env.ATLAS_URL;

if (!mongo_URL) {
    console.log("❌ ATLAS_URL not found in .env file");
    process.exit(1);
}

mongoose.connect(mongo_URL)
    .then(() => console.log("✅ Connected to MongoDB Atlas Successfully 🚀"))
    .catch(err => console.log("❌ Error in DB Connection", err));

//  SERVER CONFIG 
const port = 8080;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); // lowercase
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// VALIDATION MIDDLEWARE 
function validateListing(req, res, next) {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
}

//  ROUTES

// Home
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});

// Show all listings
app.get("/listings", wrapAsync(async (req, res) => {
    const all_listings = await Listing.find({});
    res.render("listings/index.ejs", { all_listings });
}));

// New form
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create listing
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
}));

// Show single listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);

    if (!list) throw new ExpressError(404, "Listing not found");

    res.render("listings/show.ejs", { list });
}));

// Edit form
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);

    if (!list) throw new ExpressError(404, "Listing not found");

    res.render("listings/edit.ejs", { list });
}));

// Update listing
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body, { new: true });
    res.redirect(`/listings/${id}`);
}));

// Delete listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// 404 HANDLER
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found 😢"));
});

//  ERROR HANDLER 
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});

// ================= START SERVER =================
app.listen(port, () => {
    console.log(`🚀 App is listening on port ${port}`);
});