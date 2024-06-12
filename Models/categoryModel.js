const mongoose = require('mongoose')
//1-create Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,'Category required'] ,
        unique:[true,'Category must be unique'],
        minLength:[3,'Too short category name'],
        maxLength:[32,'Too long category name']
    },
    image:String,
    // A and B => shopping.com/a-and-b
    slug:{
        type:String,
        lowercase:true
    },
},{timestamps:true})

//2-Create model on dataBase
const categoryModel = mongoose.model('Category', categorySchema)

module.exports = categoryModel