const express = require('express');
const { getBrands, getBrand, updateBrand, createBrand, deleteBrand, resizeImage, uploadCategoryImage } = require('../Services/brandService ');
const { getBrandValidator, updateBrandValidator, deleteBrandValidator, createBrandValidator } = require('../Utils/Validators/brandValidator ');



const router = express.Router()

router.route('/').get(getBrands).post(uploadCategoryImage,resizeImage,createBrandValidator,createBrand)

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(uploadCategoryImage,resizeImage,updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router;