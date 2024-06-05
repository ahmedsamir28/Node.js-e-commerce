const express = require('express')
const { getCategories } = require('../Services/categoryService')

const router = express.Router()
router.get('/', getCategories)

module.exports = router;