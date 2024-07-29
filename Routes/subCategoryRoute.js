const express = require('express');
const { createSubCategory, getSubCategories, getSubCategory, deleteSubCategory, updateSubCategory, setCategoryIdToBody, createFilterObj } = require('../Services/subCategoryService');
const { createSubCategoryValidator, getSubCategoryValidator } = require('../Utils/Validators/subCategoryValidator');

const authService = require('../Services/authService')

//merge params : Allow us to access parameters on other routers
//ex:We need to access categoryId from category router
const router = express.Router({ mergeParams: true })

router.route('/')
    .get(createFilterObj, getSubCategories)
    .post(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        updateSubCategory, updateSubCategory)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteSubCategory, deleteSubCategory)


module.exports = router;