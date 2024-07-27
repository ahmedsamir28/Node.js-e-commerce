const mongoose = require("mongoose");
//1-create Schema
const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        rating: {
            type: Number,
            min: [1, 'Min rating value is 1.0'],
            max: [5, 'Max ratings value is 5.0']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to user']
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to product']
        }
    }, { timestamps: true })

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
