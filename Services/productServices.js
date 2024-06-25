const productModel = require('../Models/productModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../Utils/apiError')

//get list of products
exports.getProducts = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const products = await productModel.find({}).skip(skip).limit(limit).populate({ path: 'category', select: 'name' })
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
    if (req.body.title)  req.body.slug = slugify(req.body.title)
    
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