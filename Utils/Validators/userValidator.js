const { check, body } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../Middlewares/validatorMiddleware');
const userModel = require('../../Models/userModel');
const bcrypt = require('bcryptjs/dist/bcrypt');

exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User required')
        .isLength({ min: 3 })
        .withMessage('Too short User name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom((val) => {
            return userModel.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail already in use'));
                }
            });
        }),

    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .custom((val, { req }) => {
            if (val !== req.body.passwordConfirm) {
                throw new Error('Password confirmation incorrect');
            }
            return true;
        }),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation required'),

    check('phone')
        .optional()
        .isMobilePhone('ar-EG')
        .withMessage('Invalid phone number; only Egyptian phone numbers are accepted'),

    check('profileImg').optional(),
    check('role').optional(),

    validatorMiddleware,
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('name').optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('currentPassword')
        .notEmpty()
        .withMessage('You must enter your current password'),
    body('passwordConfirm')
        .notEmpty()
        .withMessage('You must enter your current confirm'),
    body('password')
        .notEmpty()
        .withMessage('You must enter your new password')
        .custom(async (val, { req }) => {
            // 1) verify current password 
            const user = await userModel.findById(req.params.id)
            if (!user) {
                throw new Error('there is no user for this id')
            }
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            )
            if (!isCorrectPassword) {
                throw new Error('Incorrect current password')
            }
            
            // 2) Verify password confirm 
            if (val !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect')
            }
            return true
        }),
    validatorMiddleware,
]


exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];
