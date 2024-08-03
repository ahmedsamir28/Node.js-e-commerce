const stripe = require('stripe')(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const handler = require("./handlersFactory");
const ApiError = require("../Utils/apiError");

const cartModel = require("../Models/cartModel");
const orderModel = require("../Models/orderModel");
const productModel = require("../Models/productModel");

// @desc create cash order 
// @route POST /api/v1/orders/cartId
// @access protect /user 
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0
    const shippingPrice = 0

    // 1) Get cart depend on cartId
    const cart = await cartModel.findById(req.params.cartId)
    if (!cart) {
        return next(
            new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
        )
    }
    // 2) Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalCartPrice

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice

    // 3) Create order with default paymentMethodType cash  
    const order = await orderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice
    })

    // 4) After creating order decrement  product quantity, increment product sold 
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            }
        }))
        await productModel.bulkWrite(bulkOption, {})

        // 5) Clear cart depend on cart 
        await cartModel.findByIdAndDelete(req.params.cartId)
    }

    res.status(201).json({ status: 'Success', data: order })
})

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role == 'user') req.filterObj = { user: req.user._id }
    next()
})

// @desc Get all orders 
// @route POST /api/v1/orders
// @access protect /User-Admin-Manger
exports.findAllOrders = handler.getAll(orderModel)

// @desc Get on order
// @route POST /api/v1/orders
// @access protect /User-Admin-Manger
exports.findSpecificOrder = handler.getOne(orderModel)

// @desc Update order paid status to paid 
// @route PUT /api/v1/orders/:id/pay
// @access protect /Admin-Manger
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id)
    if (!order) {
        return next(
            new ApiError(
                `There is no such a order with this id : ${req.params.id}`, 404
            )
        )
    }

    // update order to paid 
    order.isPaid = true
    order.paidAt = Date.now()

    const updateOrder = await order.save()
    res.status(200).json({ status: 'Success', data: updateOrder })
})

// @desc Update order delivered status
// @route PUT /api/v1/orders/:id/deliver
// @access protect /Admin-Manger
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id)
    if (!order) {
        return next(
            new ApiError(
                `There is no such a order with this id : ${req.params.id}`, 404
            )
        )
    }

    // update order to paid 
    order.isDeliveredAt = true
    order.deliveredAt = Date.now()

    const updateOrder = await order.save()
    res.status(200).json({ status: 'Success', data: updateOrder })
})

// @desc Get checkout session from stripe and send it as response 
// @route GET /api/v1/orders/checkout-session/cartId
// @access protect /User

exports.checkoutSession = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart depend on cartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`There is no such cart with id ${req.params.cartId}`, 404));
    }

    // 2) Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalOrderPrice = (cartPrice + taxPrice + shippingPrice) * 100; // Multiply by 100 if EGP supports cents

    // 3) Create stripe checkout session  
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: req.user.name,
                    },
                    unit_amount: totalOrderPrice,
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress
    });

    // 4) send session to response
    res.status(200).json({ status: 'Success', session });
});