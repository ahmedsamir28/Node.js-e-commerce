const brandModel = require("../Models/brandsModel ");
const handler = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

const { uploadSingleImage } = require("../Middlewares/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

//upload single image
exports.uploadCategoryImage = uploadSingleImage("image");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .toFile(`uploads/brands/${filename}`);
  //Save image  into our db
  req.body.image = filename;
  next();
});

//get list of brands
exports.getBrands = handler.getAll(brandModel);
//get specific brand
exports.getBrand = handler.getOne(brandModel);
//create brand
exports.createBrand = handler.createOne(brandModel);
//update specific  brand
exports.updateBrand = handler.updateOne(brandModel);
//delete specific Brand
exports.deleteBrand = handler.deleteOne(brandModel);
