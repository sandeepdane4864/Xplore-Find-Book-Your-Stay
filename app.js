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
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const profileRoutes = require('./routes/profile');

// create mongo session
const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL, // your MongoDB connection string
    crypto: { secret: process.env.SESSION_SECRET },
    touchAfter: 24 * 3600 // lazy update session every 24 hours
});

store.on("error", (err) => {
    console.log("Unable to connect with Mongo session", err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    }
};

app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());

// authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// local strategy is used to authenticate users using a username and password.
// user.authenticate() is a static method used by User model to authenticate users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// serializeUser and deserializeUser are used to manage user sessions.


// middleware to flash success & error messages to all templates 
app.use((req, res, next) => {
    res.locals.user = req.user || null; // make the authenticated user available in all templates as 'user'
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// express-error is used to create custom error classes with status codes and messages
const ExpressError = require("./utils/ExpressError");

// Require ROUTES
const listingRoutes = require("./routes/listings");
const userRoutes = require("./routes/users");
const user = require("./models/user");
const bookingsRoutes = require("./routes/bookings");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Home
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});

// USE ROUTERS
app.use("/listings", listingRoutes);
app.use("/", userRoutes);
app.use("/", bookingsRoutes);
app.use("/profile", profileRoutes);


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