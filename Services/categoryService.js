const categoryModel = require('../Models/categoryModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')

//get list of categories
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const categories = await categoryModel.find({}).skip(skip).limit(limit)
    res.status(200).json({ results: categories.length, data: categories })

})

//get specific category 
exports.getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const category = await categoryModel.findById(id)
    if (!category) {
        res.status(404).json({ msg: `No category for this id ${id}` })
    }
    res.status(200).json({ data: category })
}
)

{
// use async and await
exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name
    const category = await categoryModel.create({ name, slug: slugify(name) })
    res.status(201).json({ data: category })

})

//use then and cash
// exports.createCategory = (req,res)=>{
//     const name = req.body.name
//     categoryModel.create({name, slug:slugify(name)})
//     .then((category)=>res.status(201).json({data: category}))
//     .catch((err)=>res.status(400).send(err))
// }

}