const { check, body } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../Middlewares/validatorMiddleware');
const reviewModel = require('../../Models/reviewModel');


exports.createReviewValidator = [
    check('title')
        .optional(),
    check('ratings')
        .notEmpty()
        .withMessage('ratings value required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings value must be between 1 to 5'),
    check('user')
        .isMongoId()
        .withMessage('Invalid review id format'),
    check('product')
        .isMongoId()
        .withMessage('Invalid review Id format ')
        .custom((val, { req }) =>
            reviewModel.findOne({ user: req.user._id, product: req.body.product }).then(
                (review) => {
                    if (review) {
                        return Promise.reject(
                            new Error('You already created a review before')
                        )
                    }
                }
            )
        )
    ,
    validatorMiddleware,
];


exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'), validatorMiddleware,
];

exports.updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) =>
            // check review ownerShip before update 
            reviewModel.findById(val).then((review) => {
                if (!review) {
                    return Promise.reject(
                        new Error(`there is no review with id ${val}`)
                    )
                }
                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject(
                        new Error('Your are not allowed to perform this action')
                    )
                }
            }
            )
        ),
    validatorMiddleware,
];

exports.deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) => {
            // check review ownerShip before update 
            if (req.user.role === 'user') {
                return reviewModel.findById(val).then((review) => {
                    if (!review) {
                        return Promise.reject(
                            new Error(`there is no review with id ${val}`)
                        )
                    }
                    if (review.user._id.toString() !== req.user._id.toString()) {
                        return Promise.reject(
                            new Error('Your are not allowed to perform this action')
                        )
                    }
                })
            }
            return true
        }),
    validatorMiddleware,
];
