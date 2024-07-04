const productModel = require('../Models/productModel')
const handler = require('./handlersFactory')

//get list of products
exports.getProducts =handler.getAll(productModel,'Products')
//get specific product 
exports.getProduct =handler.getOne(productModel)
//create product
exports.createProduct = handler.createOne(productModel)
//update specific product
exports.updateProduct = handler.updateOne(productModel)
//delete specific product 
exports.deleteProduct = handler.deleteOne(productModel)