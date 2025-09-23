const mongoose = require('mongoose');
const mongo_URL = "mongodb://127.0.0.1:27017/xplore"
async function main() {
    await mongoose.connect(mongo_URL);
};
main();

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required :true
    },
    email: {
        type: String,
        required: true
    },
    password :{
        type:String,
        required : true
    },
    phone_no : {
        type: Number,
        required:true
    },
    name :{
        type:String,
        required:true
    },
    gender:{
        type : String,
        required : true
    },
    DOB : {
        type:Date,
        required : true 
    }
}
);
const user = mongoose.model('user',userSchema);
module.exports = user ;