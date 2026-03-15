const User = require("../models/user");
const { cloudinary } = require("../config/cloudinary");

module.exports.getProfilePage = async (req, res) => {

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

  user.firstName = firstName;
  user.lastName = lastName;
  user.username = username;
  user.email = email;
  user.phone_no = phone_no;
  user.gender = gender;
  user.DOB = DOB;

  if (req.file) {

    // delete old profile picture from Cloudinary
    if (user.profilePicture && user.profilePicture.filename) {
      await cloudinary.uploader.destroy(user.profilePicture.filename);
    }

    // save new image
    user.profilePicture = {
      filename: req.file.filename,
      url: req.file.path || req.file.secure_url || req.file.url
    };
  }

  await user.save();

  req.flash("success", "Profile updated successfully!");
  res.redirect("/profile");
};

module.exports.getchangepasswordpage = (req, res) => {
  res.render("users/changePassword.ejs");
};

module.exports.postchangepassword = async (req, res) => {
  try {

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      req.flash("error", "New passwords do not match");
      return res.redirect("/profile/change-password");
    }

    // logged in user
    const user = req.user;

    // change password
    await user.changePassword(oldPassword, newPassword);

    req.flash("success", "Password updated successfully");

    res.redirect("/profile");

  } catch (err) {

    console.log(err);

    req.flash("error", "Current password is incorrect");

    res.redirect("/profile/change-password");

  }
};

