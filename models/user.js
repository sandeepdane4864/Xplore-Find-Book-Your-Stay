const mongoose = require('mongoose');

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