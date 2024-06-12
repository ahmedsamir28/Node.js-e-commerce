const categoryModel = require('../Models/categoryModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')

exports.getCategories = (req, res) => {
    res.send()

}

{
// ust async and await
exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name
    const category = await categoryModel.create({ name, slug: slugify(name) })
    res.status(201).json({ data: category })

})

//use then and cash
/* exports.createCategory = (req,res)=>{
    const name = req.body.name
    categoryModel.create({name, slug:slugify(name)})
    .then((category)=>res.status(201).json({data: category}))
    .catch((err)=>res.status(400).send(err))
 */
}