const brandModel = require('../Models/brandsModel ')
const handler = require('./handlersFactory')
const brandsModel = require('../Models/brandsModel ')

//get list of brands
exports.getBrands =handler.getAll(brandModel)
//get specific brand 
exports.getBrand = handler.getOne(brandModel)
//create brand 
exports.createBrand = handler.createOne(brandModel)
//update specific  brand
exports.updateBrand = handler.updateOne(brandsModel)
//delete specific Brand
exports.deleteBrand = handler.deleteOne(brandsModel)