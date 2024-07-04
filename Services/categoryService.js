const categoryModel = require('../Models/categoryModel')
const handler = require('./handlersFactory')

//get list of categories
exports.getCategories = handler.getAll(categoryModel)
//get specific category 
exports.getCategory =handler.getOne(categoryModel)
//create category
exports.createCategory = handler.createOne(categoryModel)
//update specific  category
exports.updateCategory = handler.updateOne(categoryModel)
//delete specific category 
exports.deleteCategory = handler.deleteOne(categoryModel)
