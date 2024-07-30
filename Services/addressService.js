const asyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");

// @desc Add address to user addresses list 
// @route POST / api/v1/addresses
// @access protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
    // $addToSet => add address object to user array if address not exist 
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { addresses: req.body }
        },
        { new: true }
    )
    res.status(200).json({
        status: 'Success',
        message: 'address added successfully',
        data: user.addresses
    })
})

// @desc Remove product from wishList 
// @route DELETE /api/v1/wishlist
// @access protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
    // $pull => remove address object from user addresses  array if addressId exist
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { addresses: { _id: req.params.addressId } }
        },
        { new: true }
    )
    res.status(200).json({
        status: 'Success',
        message: 'address removed successfully',
        data: user.addresses
    })
})


// @desc GET addresses user addresses list
// @route GET /api/v1/addresses
// @access protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate('addresses')
    res.status(200).json({
        status: 'Success',
        result: user.addresses.length,
        data: user.addresses
    })
})
