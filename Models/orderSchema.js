const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.objectId,
            ref: 'User',
            required: [true, 'Order must be belong to user']
        },
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Product'
                },
                quantity: Number,
                color: String,
                price: Number,
            },
        ],
        taxPrice: {
            type: Number,
            default: 0
        },
        shippingPrice: {
            type: Number,
            default: 0
        },
        totalOrderPrice: {
            type: Number
        },
        paymentMethodtype: {
            type: String,
            enum: ['card', 'cash'],
            default: 'cash'
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paidAt: Date,
        isDeliveredAt: {
            type: Boolean,
            default: false
        },
        deliveredAt: Date
    },
    { timestamps: true }
)

const orderModel  = mongoose.model('Order',orderSchema)

module.exports = orderModel