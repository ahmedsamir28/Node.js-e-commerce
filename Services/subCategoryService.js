const subCategoryModel = require('../Models/subCategoryModel')
const asyncHandler = require('express-async-handler')
const handler = require('./handlersFactory')

exports.createFilterObj = (req, res, next) => {

    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject
    next()
}


exports.setCategoryIdToBody = (req, res, next) => {
    // nested route 
    if (!req.body.category) req.body.category = req.params.categoryId
    next()
}

//get list of subCategories
exports.getSubCategories = handler.getAll(subCategoryModel)
//get specific subCategory 
exports.getSubCategory = handler.getOne(subCategoryModel)
// Create subCategories
exports.createSubCategory = handler.createOne(subCategoryModel)
//update specific  category
exports.updateSubCategory = handler.updateOne(subCategoryModel)
//delete specific SubCategory 
exports.deleteSubCategory = handler.deleteOne(subCategoryModel)
