const mongoose = require('mongoose')

//Start to create Schema
const categorySchema = new mongoose.Schema({
    name: String,
})

//Create model on  dataBase
const categoryModel = mongoose.model('Category', categorySchema)

module.exports = categoryModel