const asyncHandler = require("express-async-handler");
const productModel = require("../Models/productModel");
const cartModel = require("../Models/cartModel");
const ApiError = require("../Utils/apiError");
const couponModel = require("../Models/couponModel");

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price
    });
    cart.totalCartPrice = totalPrice
    cart.totalPriceAfterDiscount = undefined
    return totalPrice
}


// @desc Add product to cart 
// @route POST /api/v1/cart
// @access Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body
    const product = await productModel.findById(productId)
    // 1) Get cart for logged user 
    let cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        // create cart for logged user with product 
        cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price}]
        })
    } else {
        // product exist in cart, update product quantity 
        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() == productId && item.color == color
        )

        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex]
            cartItem.quantity += 1
            cart.cartItems[productIndex] = cartItem
        } else {
            // product not exist in cart , push product to cartItems array
            cart.cartItems.push({ product: productId, color, price: product.price})
        }
    }
    // Calculate total cart price 
    calcTotalCartPrice(cart)

    await cart.save()
    res.status(200).json({
        status: 'Success',
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart
    })
})

// @desc Get logged user cart 
// @route GET /api/v1/cart
// @access Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) {
        return next(
            new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
        )
    }

    res.status(200)
        .json({
            status: 'Success',
            numOfCartItems: cart.cartItems.length,
            data: cart
        })
})

// @desc Remove specific cart item   
// @route DELETE /api/v1/cart/:itemId
// @access Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } }
        },
        { new: true }
    )

    calcTotalCartPrice(cart)

    cart.save()
    res.status(200).json({
        status: 'Success',
        numOfCartItems: cart.cartItems.length,
        data: cart
    })
})

// @desc Clear specific user item    
// @route GET /api/v1/cart
// @access Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
    await cartModel.findOneAndDelete({ user: req.user._id })
    res.status(204).send()
})

// @desc Update specific cart  item quantity    
// @route PUT /api/v1/cart/:itemId
// @access Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body

    const cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) {
        return next(new ApiError(`there is no cart for user ${req.user._id}`, 404))
    }

    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() == req.params.itemId
    )
    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex]
        cartItem.quantity = quantity
        cart.cartItems[itemIndex] = cartItem
    } else {
        return next(
            new ApiError(`There is no item for this  id ${req.params.itemId}`, 404)
        )
    }

    calcTotalCartPrice(cart)
    await cart.save()
    res.status(200).json({
        status: 'Success',
        numOfCartItems: cart.cartItems.length,
        data: cart
    })
})

// @desc Apply coupon on logged user cart    
// @route PUT /api/v1/cart/applyCoupon
// @access Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    // 1) Get coupon based on coupon name 
    const coupon = await couponModel.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() }
    })

    if (!coupon) {
        return next(new ApiError('Coupon is invalid or expire'))
    }

    // 2) get logged user cart to get total cart price 
    const cart = await cartModel.findOne({ user: req.user._id })

    const totalPrice = cart.totalCartPrice

    // 3) Calculate price after priceAfterDiscount
    const totalPriceAfterDiscount = (
        totalPrice - (totalPrice * coupon.discount) / 100
    ).toFixed(2)

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount
    await cart.save()

    res.status(200).json({
        status: 'Success',
        numOfCartItems: cart.cartItems.length,
        data: cart
    })

})