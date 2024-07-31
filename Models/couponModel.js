const mongoose = require("mongoose");

const  couponSchema = new mongoose.Schema(
    {
        name :{
            type:String,
            trim:true,
            required:[true,'Coupon name required'],
            unique:true
        },
        expire : {
            type:Date,
            required:[true,'coupon expire time required']
        },
        discount:{
            type:Number,
            required:[true , 'Coupon discount value required']
        }
        
    }
)

const couponModel = mongoose.model('Coupon',couponSchema) 

module.exports = couponModel