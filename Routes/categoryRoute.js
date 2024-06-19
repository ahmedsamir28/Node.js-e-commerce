const express = require('express')
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require('../Services/categoryService')

const router = express.Router()
router.route('/').get(getCategories).post(createCategory)
router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory)


module.exports = router;