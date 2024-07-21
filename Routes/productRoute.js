const express = require('express');

const { getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeProductImages } = require('../Services/productServices');
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../Utils/Validators/productValidator');

const router = express.Router();

router.route('/').get(getProducts).post(uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(uploadProductImages,
        resizeProductImages,
        updateProductValidator,
        updateProduct
    )
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;
