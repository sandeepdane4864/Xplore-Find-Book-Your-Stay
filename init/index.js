const mongoose = require('mongoose');
const initdata = require('./data.js');
const listing = require("../models/listing.js");
const usermodel = require('../models/user.js');


const mongo_URL = "mongodb://127.0.0.1:27017/xplore"
async function main() {
    await mongoose.connect(mongo_URL);
};
main().then(
    () => console.log('Connected to DB successfully..')
).catch(
     err => console.log("Error in DB Connection", err)
);

// const initdb = async ()=>{
//     await listing.deleteMany({});
//     await listing.insertMany(initdata.data);
//     console.log("data was Initialized");
// }

const initdb = async ()=>{
    await usermodel.deleteMany({});
    await usermodel.insertOne(initdata.userdata);
    console.log("userdata entered ");
}

initdb();
