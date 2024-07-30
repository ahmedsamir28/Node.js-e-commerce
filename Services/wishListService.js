const asyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");

// @desc Add product to wishList 
// @route POST / api/v1/wishlist
// @access protected/User
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
    // $addToSet => add productId to wishList array if productId not exist 
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { wishlist: req.body.productId }
        },
        { new: true }
    )
    res.status(200).json({
        status: 'Success',
        message: 'product added successfully to your wishlist',
        data: user.wishlist
    })
})

// @desc Remove product from wishList 
// @route DELETE /api/v1/wishlist
// @access protected/User
exports.removeProductToWishList = asyncHandler(async (req, res, next) => {
    // $pull => remove productId to wishList array if productId not exist 
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { wishlist: req.params.productId }
        },
        { new: true }
    )
    res.status(200).json({
        status: 'Success',
        message: 'product removed successfully from your wishlist.',
        data: user.wishlist
    })
})


// @desc GET logged user wishlist
// @route GET /api/v1/wishlist
// @access protected/User
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate('wishlist')
    res.status(200).json({
        status: 'Success',
        result: user.wishlist.length,
        data: user.wishlist
    })
})
