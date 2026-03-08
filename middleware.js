module.exports.IsloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // redirect 
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Please Login first ! ");
        return res.redirect("/login");
    }
    next();
}



const { userSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");   


module.exports.SaveReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
