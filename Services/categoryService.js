const categoryModel = require('../Models/categoryModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../Utils/apiError')
const ApiFeatures = require('../Utils/apiFeatures')
const handler = require('./handlersFactory')

//get list of categories
exports.getCategories = asyncHandler(async (req, res,next) => {
    
    const documentCounts = await categoryModel.countDocuments()
    // Build Query
    const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
        .pagination(documentCounts)
        .filter()
        .search()
        .limitFields()
        .sort();

    const { mongooseQuery, paginationResult } = apiFeatures

    const categories = await mongooseQuery;    
    res.status(200).json({ results: categories.length,paginationResult, data: categories })

})

//get specific category 
exports.getCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params
    const category = await categoryModel.findById(id)
    if (!category) {
        // res.status(404).json({ msg: `No category for this id ${id}` })
        return next(new ApiError( `No category for this id ${id}`,400))
    }
    res.status(200).json({ data: category })
}
)

exports.createCategory = handler.createOne(categoryModel)
//update specific  category
exports.updateCategory = handler.updateOne(categoryModel)
//delete specific category 
exports.deleteCategory = handler.deleteOne(categoryModel)
