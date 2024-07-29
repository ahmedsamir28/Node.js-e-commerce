const express = require('express')

const { getCategories, createCategory, getCategory, updateCategory, deleteCategory, uploadCategoryImage, resizeImage } = require('../Services/categoryService');
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../Utils/Validators/categoryValidator');
const subCategoriesRoute = require('./subCategoryRoute')
const authService = require('../Services/authService')
const router = express.Router()

router.use('/:categoryId/subcategories', subCategoriesRoute)
router.route('/')
    .get(getCategories)
    .post(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadCategoryImage, resizeImage, createCategoryValidator, createCategory
    )

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory
    )
    .delete(authService.protect,
        authService.allowedTo('admin'),
        deleteCategoryValidator, deleteCategory
    )


module.exports = router;