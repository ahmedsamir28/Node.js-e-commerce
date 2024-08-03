const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                color: String,
                price: Number,
            },
        ],
        totalCartPrice: Number,
        totalPriceAfterDiscount: Number,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }, { timestamps: true }
)

//Mongoose query middleware
cartSchema.pre(/^find/, function (next) {
    this.populate({
        path:'cartItems.product',
        select :'title imageCover'
    })
    next()
})

const cartModel = mongoose.model('Cart', cartSchema)

module.exports = cartModel