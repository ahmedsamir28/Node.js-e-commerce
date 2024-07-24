const express = require('express')

const { getCategories, createCategory, getCategory, updateCategory, deleteCategory, uploadCategoryImage, resizeImage } = require('../Services/categoryService');
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../Utils/Validators/categoryValidator');
const subCategoriesRoute = require('./subCategoryRoute')
const AuthService = require('../Services/authService')
const router = express.Router()

router.use('/:categoryId/subcategories', subCategoriesRoute)
router.route('/').get(getCategories).post(
    AuthService.protect,
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory)

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)


module.exports = router;