const express = require('express');

const authService = require('../Services/authService');
const { addProductToCart, getLoggedUserCart, removeSpecificCartItem, clearCart, updateCartItemQuantity, applyCoupon } = require('../Services/cartService');

const router = express.Router()


router.use(authService.protect, authService.allowedTo('user'))
router.route('/').post(addProductToCart).get(getLoggedUserCart).delete(clearCart)
router.put('/applyCoupon',applyCoupon)
router.route('/:itemId').put(updateCartItemQuantity).delete(removeSpecificCartItem)



module.exports = router;