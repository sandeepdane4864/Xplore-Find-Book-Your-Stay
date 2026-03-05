const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    
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
    }
    
})

module.exports = mongoose.model('Review', reviewSchema);