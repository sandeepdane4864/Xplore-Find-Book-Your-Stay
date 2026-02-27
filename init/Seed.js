require("dotenv").config();
const mongoose = require("mongoose");

const Listing = require("../models/listing");
const User = require("../models/user");
const initdata = require("./data");

const mongo_URL = process.env.ATLAS_URL;

async function seedDB() {
    try {
        await mongoose.connect(mongo_URL);
        console.log("✅ Connected to Atlas");

        await Listing.deleteMany({});
        await User.deleteMany({});

        await Listing.insertMany(initdata.data);
        await User.create(initdata.userdata);

        console.log("🎉 Sample Data Inserted Successfully");

        await mongoose.connection.close();
        console.log("🔌 Connection Closed");
    } catch (err) {
        console.log("❌ Error:", err);
    }
}

seedDB();