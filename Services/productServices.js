const productModel = require('../Models/productModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../Utils/apiError')

//get list of products
exports.getProducts = asyncHandler(async (req, res, next) => {
    // 1) pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit

    // 2) Filltering
    const queryStrinObj = { ...req.query }
    const excludesFields = ['page', 'sort', 'limit', 'fields']
    excludesFields.forEach((field) => delete queryStrinObj[field])

    // Apply filteration using [gte,gt,lte,lt]
    let queryStr = JSON.stringify(queryStrinObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    //Build Query
    let mongooseQuery = productModel.find(JSON.parse(queryStr))
        .skip(skip)
        .limit(limit)
        .populate({ path: 'category', select: 'name' })

    // 3) Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        mongooseQuery = mongooseQuery.sort(sortBy)
    } else {
        mongooseQuery = mongooseQuery.sort('-createAt')
    }

    // 4) Sorting
    if (req.query.fields) {
        //title,ratingAverage,imageCover,price
        const fields = req.query.fields.split(',').join(' ')
        //title ratingAverage imageCover price
        mongooseQuery = mongooseQuery.select(fields)
    } else {
        mongooseQuery = mongooseQuery.select('-__v')

    }
    const products = await mongooseQuery
    res.status(200).json({ results: products.length, page, data: products })
})

//get specific product 
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await productModel.findById(id)
    if (!product) {
        return next(new ApiError(`No product for this id ${id}`, 400))
    }
    res.status(200).json({ data: product })
}
)

exports.createProduct = asyncHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.title);
    const product = await productModel.create(req.body);
    res.status(201).json({ data: product });
});

//update specific product
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (req.body.title) req.body.slug = slugify(req.body.title)

    const product = await productModel.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    )
    if (!product) {
        return next(new ApiError(`No product for this id ${id}`, 400))
    }
    res.status(200).json({ data: product })
})

//delete specific product 
exports.deleteProduct = (asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await productModel.findByIdAndDelete(id)
    if (!product) {
        // res.status(404).json({ msg: `No category for this id ${id}` })
        return next(new ApiError(`No product for this id ${id}`, 400))
    }
    res.status(204).send()
}))