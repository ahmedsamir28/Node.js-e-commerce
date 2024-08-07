const mongoose = require("mongoose");
const productModel = require("./productModel");
//1-create Schema
const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        ratings: {
            type: Number,
            min: [1, 'Min rating value is 1.0'],
            max: [5, 'Max ratings value is 5.0']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to user']
        },
        // parent reference (one to many)
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to product']
        }
    }, { timestamps: true })

//Mongoose query middleware
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name'
    })
    next()
})

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (productId) {
    const result = await this.aggregate([
        // Stage 1 :get all reviews in specific product
        {
            $match: { product: productId },
        },
        // Stage 2: Grouping reviews based on productID and calc  avgRatings, ratingsQuantity
        {
            $group: {
                _id: 'product',
                avgRatings: { $avg: '$ratings' },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ])

    if (result.length > 0) {
        await productModel.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingsQuantity: result[0].ratingsQuantity
        })
    } else {
        await productModel.findOneAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        })
    }
}

reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product)
})

// reviewSchema.pre('remove', async function (next) {
//     this.constructor.calcAverageRatingsAndQuantity(this.product);
//     next()
// });


const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
