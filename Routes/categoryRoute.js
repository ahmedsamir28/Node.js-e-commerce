const express = require('express')
const { param, validationResult } = require('express-validator');

const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require('../Services/categoryService');
const validatorMiddleware = require('../Middlewares/validatorMiddleware');
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../Utils/Validators/categoryValidator');

const router = express.Router()
router.route('/').get(getCategories).post(createCategoryValidator, createCategory)
router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)


module.exports = router;