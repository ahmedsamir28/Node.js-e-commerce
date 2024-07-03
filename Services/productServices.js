const productModel = require('../Models/productModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../Utils/apiError')
const ApiFeatures = require('../Utils/apiFeatures')
const handler = require('./handlersFactory')

//get list of products
exports.getProducts = asyncHandler(async (req, res, next) => {
    console.log('Query Parameters:', req.query);
    const documentCounts = await productModel.countDocuments();

    // Build Query
    const apiFeatures = new ApiFeatures(productModel.find(), req.query)
        .filter()
        .search('Products')  // Make sure 'Products' is passed here
        .sort()
        .limitFields()
        .pagination(documentCounts);

    const { mongooseQuery, paginationResult } = apiFeatures;
    const products = await mongooseQuery;

    console.log('Found Products:', products);
    
    res.status(200).json({ results: products.length, paginationResult, data: products });
});

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
exports.updateProduct = handler.updateOne(productModel)
//delete specific product 
exports.deleteProduct = handler.deleteOne(productModel)