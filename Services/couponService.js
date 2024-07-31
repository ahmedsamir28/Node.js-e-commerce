const couponModel = require("../Models/couponModel");
const handler = require("./handlersFactory");


//get list of coupons
exports.getCoupons = handler.getAll(couponModel);
//get specific coupon
exports.getCoupon = handler.getOne(couponModel);
//create coupon
exports.createCoupon = handler.createOne(couponModel);
//update specific  coupon
exports.updateCoupon = handler.updateOne(couponModel);
//delete specific Coupon
exports.deleteCoupon = handler.deleteOne(couponModel);
