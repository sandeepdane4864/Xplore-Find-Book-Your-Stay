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
        console.log("🗑️ Old data deleted");

        // Insert new data
        initdata.data = initdata.data.map((obj)=>({...obj, owner: "69b3faec00ec99a54297dbba"})
        );
        await Listing.insertMany(initdata.data);

        console.log("🎉 Sample Data Inserted Successfully");
    } catch (err) {
        console.error("❌ Error seeding database:", err);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Connection Closed");
    }
}

seedDB();