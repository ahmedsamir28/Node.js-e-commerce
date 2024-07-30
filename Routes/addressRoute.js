const express = require('express');
const authService = require('../Services/authService');
const { addProductToWishList, removeProductToWishList, getLoggedUserWishList } = require('../Services/wishListService');
const { addAddress, getLoggedUserAddresses, removeAddress } = require('../Services/addressService');

const router = express.Router();

router.use(authService.protect,authService.allowedTo('user'))


router.route('/').post(addAddress).get(getLoggedUserAddresses)

router.delete('/:productId',removeAddress)

module.exports = router;
