const brandModel = require('../Models/brandsModel ')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../Utils/apiError')

//get list of categories
exports.getBrands = asyncHandler(async (req, res,next) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const brands = await brandModel.find({}).skip(skip).limit(limit)
    res.status(200).json({ results: brands.length,page, data: brands })

})

//get specific category 
exports.getBrand= asyncHandler(async (req, res,next) => {
    const { id } = req.params
    const Brand= await brandModel.findById(id)
    if (!Brand) {
        // res.status(404).json({ msg: `No Brandfor this id ${id}` })
        return next(new ApiError( `No Brandfor this id ${id}`,400))
    }
    res.status(200).json({ data: Brand})
}
)

{
    // use async and await
    exports.createBrand= asyncHandler(async (req, res,next) => {
        // const name = req.body.name
        const {name} = req.body

        const Brand= await brandModel.create({ name, slug: slugify(name) })
        res.status(201).json({ data: Brand})

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
exports.updateBrand= asyncHandler(async (req, res,next) => {
    const { id } = req.params
    const { name } = req.body

    const Brand= await brandModel.findOneAndUpdate(
        { _id: id },
        { name: name, slug: slugify(name) },
        { new: true }
    )
    if (!Brand) {
        // res.status(404).json({ msg: `No Brandfor this id ${id}` })
        return next(new ApiError( `No Brandfor this id ${id}`,400))
    }
    res.status(200).json({ data: Brand})
})

//delete specific Brand
exports.deleteBrand=(asyncHandler(async (req, res,next) => {
    const { id } = req.params
    const Brand= await brandModel.findByIdAndDelete(id)
    if (!Brand) {
        // res.status(404).json({ msg: `No Brandfor this id ${id}` })
        return next(new ApiError( `No Brandfor this id ${id}`,400))
    }
    res.status(204).send()
}))