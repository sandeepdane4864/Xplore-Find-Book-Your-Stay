const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({ 
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        min: 5,
        max: 500,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    
})

module.exports = mongoose.model('Review', reviewSchema);