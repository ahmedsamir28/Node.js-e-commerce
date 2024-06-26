const subCategoryModel = require('../Models/subCategoryModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../Utils/apiError')

exports.createFilterObj = (req, res, next) => {

    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject
    next()
}

//get list of subCategories
exports.getSubCategories = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit


    const subCategories = await subCategoryModel.find(req.filterObj).skip(skip).limit(limit).populate({ path: 'category', select: 'name' });

    res.status(200).json({ results: subCategories.length, page, data: subCategories })

})

//get specific subCategory 
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const subCategory = await subCategoryModel.findById(id).populate({ path: 'category', select: 'name -_id' });

    if (!subCategory) {
        return next(new ApiError(`No category for this id ${id}`, 400))
    }
    res.status(200).json({ data: subCategory })
}
)

exports.setCategoryIdToBody = (req, res, next) => {
    // nested route 
    if (!req.body.category) req.body.category = req.params.categoryId
    next()

}

// Create subCategories
exports.createSubCategory = asyncHandler(async (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId

    // const name = req.body.name
    const { name, category } = req.body

    const suCategory = await subCategoryModel.create(
        { name, slug: slugify(name), category }
    )
    res.status(201).json({ data: suCategory })
})

//update specific  category
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, category } = req.body

    const subCategory = await subCategoryModel.findOneAndUpdate(
        { _id: id },
        { name: name, slug: slugify(name), category },
        { new: true }
    )
    if (!subCategory) {
        // res.status(404).json({ msg: `No SubCategory for this id ${id}` })
        return next(new ApiError(`No SubCategory for this id ${id}`, 400))
    }
    res.status(200).json({ data: subCategory })
})

//delete specific SubCategory 
exports.deleteSubCategory = (asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const subCategory = await subCategoryModel.findByIdAndDelete(id)
    if (!subCategory) {
        // res.status(404).json({ msg: `No SubCategory for this id ${id}` })
        return next(new ApiError(`No SubCategory for this id ${id}`, 400))
    }
    res.status(204).send()
}))

