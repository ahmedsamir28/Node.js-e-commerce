const reviewModel = require("../Models/reviewModel");
const handler = require("./handlersFactory");

// Nested route 
// Get /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject
    next()
}

// Nested route 
exports.setProductAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId
    if (!req.body.user) req.body.user = req.user._id
    next()
}

//get list of reviews
exports.getReviews = handler.getAll(reviewModel);
//get specific review
exports.getReview = handler.getOne(reviewModel);
//create review
exports.createReview = handler.createOne(reviewModel);
//update specific  review
exports.updateReview = handler.updateOne(reviewModel);
//delete specific Review
exports.deleteReview = handler.deleteOne(reviewModel);
