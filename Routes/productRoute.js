const express = require('express');

const { getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeProductImages } = require('../Services/productServices');
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../Utils/Validators/productValidator');

const authService = require('../Services/authService')

const router = express.Router();

router.route('/').get(getProducts).post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadProductImages, resizeProductImages, createProductValidator, createProduct
);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadProductImages, resizeProductImages, updateProductValidator, updateProduct
    )
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteProductValidator, deleteProduct);

module.exports = router;
