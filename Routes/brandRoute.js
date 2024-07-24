const express = require('express');
const { getBrands, getBrand, updateBrand, createBrand, deleteBrand, resizeImage, uploadBrandImage } = require('../Services/brandService ');
const { getBrandValidator, updateBrandValidator, deleteBrandValidator, createBrandValidator } = require('../Utils/Validators/brandValidator ');



const router = express.Router()

router.route('/').get(getBrands).post(uploadBrandImage,resizeImage,createBrandValidator,createBrand)

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(uploadBrandImage,resizeImage,updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router;