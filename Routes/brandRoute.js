const express = require('express');

const { getBrands, getBrand, updateBrand, createBrand, deleteBrand, resizeImage, uploadBrandImage } = require('../Services/brandService ');
const { getBrandValidator, updateBrandValidator, deleteBrandValidator, createBrandValidator } = require('../Utils/Validators/brandValidator ');

const authService = require('../Services/authService')

const router = express.Router()

router.route('/').get(getBrands).post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadBrandImage, resizeImage, createBrandValidator, createBrand
)

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteBrandValidator, deleteBrand)


module.exports = router;