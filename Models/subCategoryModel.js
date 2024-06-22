const mongoose = require('mongoose')
//1-create Schema
const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        unique:[true,'SubCategory must be unique'],
        minLength:[2,'Too short category name'],
        maxLength:[32,'Too long category name']
    },
    slug:{
        type:String,
        lowercase:true
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'category',
        required :[true,'SubCategory must be belong to parent category']
    }
},{timestamps:true})

//2-Create model on dataBase
module.exports = mongoose.model('SubCategory', subcategorySchema)