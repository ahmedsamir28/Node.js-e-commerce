const express = require('express');
const authService = require('../Services/authService');
const { addProductToWishList, removeProductToWishList, getLoggedUserWishList } = require('../Services/wishListService');

const router = express.Router();

router.use(authService.protect,authService.allowedTo('user'))


router.route('/').post(addProductToWishList).get(getLoggedUserWishList)

router.delete('/:productId',removeProductToWishList)

module.exports = router;
