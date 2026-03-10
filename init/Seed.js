require("dotenv").config();
const mongoose = require("mongoose");

const Listing = require("../models/listing");
const User = require("../models/user");
const initdata = require("./data");

const mongoURL = process.env.ATLAS_URL;

async function seedDB() {
    try {
        if (!mongoURL) {
            throw new Error("ATLAS_URL not found in .env file");
        }

        await mongoose.connect(mongoURL);
        console.log("✅ Connected to MongoDB Atlas");

        // Clear old data
        await Listing.deleteMany({});
        await User.deleteMany({});
        console.log("🗑️ Old data deleted");

        // Insert new data
        // insert owner field in listing data
        const user = await User.create(initdata.userdata[0]);
        initdata.data.forEach(listing => {
            listing.owner = user._id;
        });
        await Listing.insertMany(initdata.data);

        await User.create(initdata.userdata);

        console.log("🎉 Sample Data Inserted Successfully");
    } catch (err) {
        console.error("❌ Error seeding database:", err);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Connection Closed");
    }
}

seedDB();