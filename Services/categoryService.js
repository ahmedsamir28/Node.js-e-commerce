const categoryModel = require('../Models/categoryModel');
const handler = require('./handlersFactory')
const asyncHandler = require('express-async-handler');

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { uploadSingleImage } = require('../Middlewares/uploadImageMiddleware');

//upload single image  
exports.uploadCategoryImage = uploadSingleImage('image')
//image processing
exports.resizeImage =asyncHandler(async(req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .toFile(`uploads/categories/${filename}`)
        //Save image  into our db 
        req.body.image = filename
        next()
})

//get list of categories
exports.getCategories = handler.getAll(categoryModel)
//get specific category 
exports.getCategory = handler.getOne(categoryModel)
//create category
exports.createCategory = handler.createOne(categoryModel)
//update specific  category
exports.updateCategory = handler.updateOne(categoryModel)
//delete specific category 
exports.deleteCategory = handler.deleteOne(categoryModel)
