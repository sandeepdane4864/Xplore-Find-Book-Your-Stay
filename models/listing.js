const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1757664712627-868519088717?q=80&w=2070&auto=format&fit=crop"
        }
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    

});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;