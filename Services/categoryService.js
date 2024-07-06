const categoryModel = require('../Models/categoryModel')
const handler = require('./handlersFactory')
const multer =  require('multer')
const { v4: uuidv4 } = require('uuid');

//1- DiskStorage engine
const multerStorage =  multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/categories')
    },
    filename:function(req,file,cb){
        //category-${id}-Date.now().jpeg
        const ext =file.mimetype.split('/')[1]
        const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
        cb(null, filename)
    },
})


const upload = multer({storage:multerStorage})

exports.uploadCategoryImage = upload.single('image')
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
