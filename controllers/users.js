const User = require("../models/user");

module.exports.getSignupForm = (req, res) => {
    res.render("users/signup.ejs", { errors: {}, old: {} });
};

module.exports.postSignupnewUser = async (req, res) => {
    try {
        const newUser = new User(req.body.user);
        if (req.file) {
            newUser.profilePicture = {
                filename: req.file.filename,
                url: "/uploads/profilePictures/" + req.file.filename
            };
        }
        await User.register(newUser, req.body.user.password);
        req.login(newUser, (err) => {
            if (err) {
                console.log("Error during auto-login after registration:", err);
                req.flash("error", "An error occurred during login. Please try logging in manually.");
                return res.redirect("/login");
            } else {
                req.flash("success", "Welcome, " + newUser.username + "! Your account has been created successfully.");
                return res.redirect("/listings");
            }

        });

    } catch (e) {


        if (e.code === 11000) {
            req.flash("error", "email already exists");
            res.redirect("/signup");
        }
        if (e.code === 11000 && e.keyPattern && e.keyPattern.username) {
            req.flash("error", "username already exists");
            res.redirect("/signup");
        }
    }
};

module.exports.getLoginpage = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.authenticatUser = async (req, res) => {
    req.flash("success", "Welcome back, " + req.user.username + "!");
    Orignialurl = res.locals.redirectUrl || "/listings";
    res.redirect(Orignialurl);
}

module.exports.LogOutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("Error during logout:", err);
            req.flash("error", "An error occurred while logging out. Please try again.");
            return res.redirect("/listings");
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
}