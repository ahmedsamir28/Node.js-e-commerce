const express = require('express');
const { getBrands, getBrand, updateBrand, createBrand, deleteBrand } = require('../Services/brandService ');
const { getBrandValidator, updateBrandValidator, deleteBrandValidator, createBrandValidator } = require('../Utils/Validators/brandValidator ');



const router = express.Router()

router.route('/').get(getBrands).post(createBrandValidator,createBrand)

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router;