const express = require('express');

const authService = require('../Services/authService');
const { getReviews, createReview, getReview, deleteReview, updateReview, createFilterObj, setProductAndUserIdToBody } = require('../Services/reviewService ');
const { createReviewValidator, getReviewValidator, updateReviewValidator, deleteReviewValidator } = require('../Utils/Validators/reviewValidator');

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(createFilterObj,getReviews)
    .post(
        authService.protect,
        authService.allowedTo('user'),
        setProductAndUserIdToBody,
        createReviewValidator,
        createReview
    )

router.route('/:id')
    .get(getReviewValidator, getReview)
    .put(authService.protect, authService.allowedTo('user'), updateReviewValidator, updateReview)
    .delete(
        authService.protect,
        authService.allowedTo('user', 'manager', 'admin'),
        deleteReviewValidator,
        deleteReview)


module.exports = router;