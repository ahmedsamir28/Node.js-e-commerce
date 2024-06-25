const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");
const categoryModel = require("../../Models/categoryModel");
const subCategoryModel = require('../../Models/subCategoryModel')


exports.getProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format'), validatorMiddleware,
]

exports.createProductValidator = [
    check("title")
        .isLength({ min: 3 })
        .withMessage("Must be at least 3 chars")
        .notEmpty()
        .withMessage("Product required"),
    check("description")
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ max: 2000 })
        .withMessage("Too ong description"),
    check("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    check("sold")
        .optional()
        .isNumeric()
        .withMessage("Product sold must be a number"),
    check("price")
        .notEmpty()
        .withMessage("Product price is require")
        .isNumeric()
        .withMessage("Product price must be a number")
        .isLength({ max: 32 })
        .withMessage("to long price"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Product priceAfterDiscount must be a number")
        .isFloat()
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error('priceAfterDiscount must be lower than price')
            }
            return value
        }),
    check('colors')
        .optional()
        .isArray()
        .withMessage('availableColors should be array of string'),
    check('imageCover')
        .notEmpty()
        .withMessage('Product imageCover is require'),
    check('images')
        .optional()
        .isArray()
        .withMessage('images should be array of string'),
    check('category')
        .notEmpty()
        .withMessage('product must be belong to a category')
        .isMongoId()
        .withMessage('Invalid id format')
        .custom((categorId) => categoryModel.findById(categorId).then(category => {
            if (!category) {
                return Promise.reject(
                    new Error(`No category for this id: ${categorId}`)
                )
            }
        })),
    check('SubCategory').optional().isMongoId().withMessage('Invalid Id Formate')
        .custom((subCategoriesId) => {
            subCategoryModel.find({ _id: { $exists: true, $in:subCategoriesId}}).then(
                (result)=>{
                    if (result.length < 1 || result.length !== subCategoriesId.length) {
                        return Promise.reject(new Error('Invalid subcaegories'))
                    }
                }
            )
        }),
    check('brand').optional().isMongoId().withMessage('Invalid Id Formate'),
    check('ratingsAverage')
        .optional()
        .isNumeric()
        .withMessage('ratingAverage must be a number')
        .isLength({ min: 1 })
        .withMessage('Rating must be abovee or equal 1.0')
        .isLength({ max: 5 })
        .withMessage('Rating must be below or equal 5.0'),
    check('ratingsQuantity')
        .optional()
        .isNumeric()
        .withMessage('ratingsQuantity must be a number'),
    validatorMiddleware,
];

exports.updateProductValidator = [
    check("id").isMongoId().withMessage("Invalid Product id format"),
    validatorMiddleware,
];

exports.deleteProductValidator = [
    check("id").isMongoId().withMessage("Invalid Product id format"),
    validatorMiddleware,
];
