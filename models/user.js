const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    profilePicture: {
        filename: {
            type: String,
            default: "https://res.cloudinary.com/dzqj8y1w6/image/upload/v1700000000/default-profile-picture.png"
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/dzqj8y1w6/image/upload/v1700000000/default-profile-picture.png"
        }
    },
    phone_no: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Virtual full name
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);