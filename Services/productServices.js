const multer = require('multer')
const productModel = require('../Models/productModel')
const handler = require('./handlersFactory')
const ApiError = require('../Utils/apiError')
const asyncHandler = require('express-async-handler')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const { uploadMixOfImages } = require('../Middlewares/uploadImageMiddleware')


exports.uploadProductImages = uploadMixOfImages([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
])

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    // 1 - image processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFileName}`)
        // Save image into our db 
        req.body.imageCover = imageCoverFileName
    }

    // 2 - image processing for images
    if (req.files.images) {
        req.body.images = []
        await Promise.all(req.files.images.map(async (img, index) => {
            const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
            await sharp(img.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 95 })
                .toFile(`uploads/products/${imageName}`)
            // Save image into our db 
            req.body.images.push(imageName)
        })
        )
    }
    next()
})

//get list of products
exports.getProducts = handler.getAll(productModel, 'Products')
//get specific product 
exports.getProduct = handler.getOne(productModel)
//create product
exports.createProduct = handler.createOne(productModel)
//update specific product
exports.updateProduct = handler.updateOne(productModel)
//delete specific product 
exports.deleteProduct = handler.deleteOne(productModel)