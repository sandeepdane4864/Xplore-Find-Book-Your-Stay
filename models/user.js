const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({

    googleId: {
        type: String,
        unique: true,
        sparse: true   // important: allows null values
    },

    firstName: {
        type: String,
        trim: true
    },

    lastName: {
        type: String,
        trim: true
    },

    username: {
        type: String,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true
    },

    profilePicture: {
        filename: {
            type: String,
            default: "123.jpg"
        },
        url: {
            type: String,
            default: "/uploads/profilePictures/123.jpg"
        }
    },

    phone_no: {
        type: String
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },

    DOB: {
        type: Date
    },

    resetToken: String,
    resetTokenExpire: Date

}, { timestamps: true });

/* Virtual full name */
userSchema.virtual("fullName").get(function () {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

/* Passport local plugin */
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);