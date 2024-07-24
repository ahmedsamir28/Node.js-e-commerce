const userModel = require("../Models/userModel");
const handler = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

const { uploadSingleImage } = require("../Middlewares/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ApiError = require("../Utils/apiError");
const bcrypt = require("bcryptjs/dist/bcrypt");

//upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .toFile(`uploads/users/${filename}`);
        //Save image  into our db
        req.body.profileImg = filename;
    }
    next();
});

//get list of brands
exports.getUsers = handler.getAll(userModel);
//get specific User
exports.getUser = handler.getOne(userModel);
//create User
exports.createUser = handler.createOne(userModel);
//update specific  User
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileImg: req.body.profileImg,
            role: req.body.role
        },
        { new: true });
    if (!document) {
        return next(new ApiError(`No document for this id ${id}`, 400));
    }
    res.status(200).json({ data: document });
});
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            password:await bcrypt.hash(req.body.password,12)
        },
        { new: true });
    if (!document) {
        return next(new ApiError(`No document for this id ${id}`, 400));
    }
    res.status(200).json({ data: document });
});
//delete specific User
exports.deleteUser = handler.deleteOne(userModel);
