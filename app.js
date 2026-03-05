// ENV CONFIG
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/setcookie", (req, res) => {
    res.cookie("username", "john_doe", { maxAge: 900000, httpOnly: true });
    res.send("Cookie has been set!");
});


// express-error is used to create custom error classes with status codes and messages
const ExpressError = require("./utils/ExpressError");

// Require ROUTES
const listingRoutes = require("./routes/listings");
const userRoutes = require("./routes/users");

// DATABASE CONNECTION
const mongo_URL = process.env.ATLAS_URL;

if (!mongo_URL) {
    console.log("ATLAS_URL not found in .env file");
    process.exit(1);
}

mongoose.connect(mongo_URL)
    .then(() => console.log("✅ Connected to MongoDB Atlas Successfully 🚀"))
    .catch(err => console.log("❌ Error in DB Connection", err));

// SERVER CONFIG
const port = 8080;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
// middleware to serve uploaded images from the public/uploads directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


// Home
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});

// USE ROUTERS
app.use("/listings", listingRoutes);
app.use("/", userRoutes);


// 404 HANDLER
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found 😢"));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});

// START SERVER
app.listen(port, () => {
    console.log(`🚀 App is listening on port http://www.localhost:${port}`);
});