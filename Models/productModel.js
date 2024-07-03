const mongoose = require('mongoose');

// 1- Create Schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Too short product title'],
        maxlength: [50, 'Too long product title'], 
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [20, 'Too short product description'],
        maxlength: [2000, 'Too long description'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        max: [200000, 'Too high product price'],
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: [String], 
    imageCover: {
        type: String,
        required: [true, 'Product imageCover is required'],
    },
    images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: [true, 'Product must belong to a category'],
    },
    subcategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage: { 
        type: Number,
        min: [1, 'Rating must be above or equal to 1.0'],
        max: [5, 'Rating must be below or equal to 5.0'], 
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// 2- Create model on database
module.exports = mongoose.model('Product', productSchema);
