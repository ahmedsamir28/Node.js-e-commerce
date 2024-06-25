const express = require('express')

const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require('../Services/categoryService');
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../Utils/Validators/categoryValidator');
const subCategoriesRoute = require('./subCategoryRoute')

const router = express.Router()

router.use('/:categoryId/subcategories',subCategoriesRoute)
router.route('/').get(getCategories).post(createCategoryValidator, createCategory)

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)


module.exports = router;