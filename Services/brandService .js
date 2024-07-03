const brandModel = require('../Models/brandsModel ')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../Utils/apiError')
const ApiFeatures = require('../Utils/apiFeatures')
const handler = require('./handlersFactory')
const brandsModel = require('../Models/brandsModel ')

//get list of categories
exports.getBrands = asyncHandler(async (req, res, next) => {

    const documentCounts = await brandModel.countDocuments()
    // Build Query
    const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
        .pagination(documentCounts)
        .filter()
        .search()
        .limitFields()
        .sort();

    const { mongooseQuery, paginationResult } = apiFeatures

    const brands = await mongooseQuery;
    res.status(200).json({ results: brands.length, paginationResult, data: brands })

})

//get specific category 
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const Brand = await brandModel.findById(id)
    if (!Brand) {
        // res.status(404).json({ msg: `No Brand for this id ${id}` })
        return next(new ApiError(`No Brand for this id ${id}`, 400))
    }
    res.status(200).json({ data: Brand })
}
)

{
    // use async and await
    exports.createBrand = asyncHandler(async (req, res, next) => {
        // const name = req.body.name
        const { name } = req.body

        const Brand = await brandModel.create({ name, slug: slugify(name) })
        res.status(201).json({ data: Brand })

    })

    //use then and cash
    // exports.createBrand= (req,res)=>{
    //     const name = req.body.name
    //     brandModel.create({name, slug:slugify(name)})
    //     .then((brand)=>res.status(201).json({data: brand}))
    //     .catch((err)=>res.status(400).send(err))
    // }

}

//update specific  brand
exports.updateBrand = handler.updateOne(brandsModel)
//delete specific Brand
exports.deleteBrand = handler.deleteOne(brandsModel)