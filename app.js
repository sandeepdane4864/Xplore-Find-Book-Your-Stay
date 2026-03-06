// ENV CONFIG
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
 
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookies :{
        //difference btw expires and maxage is that expires sets an absolute expiration date for the cookie
        // while maxage sets a relative expiration time from the moment the cookie is set.
        expires : Date.now() + 1000 * 60 * 60 * 24 , // 1 day
        maxage : 1000 * 60 * 60 * 24 , // 1 day,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(cookieParser());
app.use(flash()); 

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
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
// use express.urlencoded middleware to parse incoming request bodies 
// in a middleware before your handlers, available under the req.body property.
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