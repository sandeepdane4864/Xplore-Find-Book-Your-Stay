const User = require("../models/user");

module.exports.getProfilePage =async (req, res) => {

    const user = await User.findById(req.user._id);

    res.render("users/profile", { user });

};

module.exports.getEditProfilepage = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render("users/edit.ejs", { user });
};

module.exports.editProfiledetails = async (req, res) => {

    const { firstName, lastName, username, email, phone_no, gender, DOB } = req.body;

    const user = await User.findById(req.user._id);

    // Update basic fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;
    user.phone_no = phone_no;
    user.gender = gender;
    user.DOB = DOB;

    // Update profile picture if uploaded
    if (req.file) {
        user.profilePicture = {
            filename: req.file.filename,
            url: "/uploads/profilePictures/" + req.file.filename
        };
    }

    await user.save();

    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
};


