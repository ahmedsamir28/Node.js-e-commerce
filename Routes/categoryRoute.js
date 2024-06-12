const express = require('express')
const { getCategories, createCategory } = require('../Services/categoryService')

const router = express.Router()
router.route('/').get(getCategories).post(createCategory)


module.exports = router;