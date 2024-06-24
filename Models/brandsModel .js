const mongoose = require('mongoose')
//1-create Schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,'brand required'] ,
        unique:[true,'brand must be unique'],
        minLength:[3,'Too short brand name'],
        maxLength:[32,'Too long brand name']
    },
    image:String,
    // A and B => shopping.com/a-and-b
    slug:{
        type:String,
        lowercase:true
    },
},{timestamps:true})

//2-Create model on dataBase
module.exports = mongoose.model('brands', brandSchema)

