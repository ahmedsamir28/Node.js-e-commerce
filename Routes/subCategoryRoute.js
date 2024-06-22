const express = require('express');
const { createSubCategory, getSubCategories, getSubCategory, deleteSubCategory, updateSubCategory } = require('../Services/subCategoryService');
const { createSubCategoryValidator, getSubCategoryValidator } = require('../Utils/Validators/subCategoryValidator');

//merge params : Allow us to access parameters on other routers
//ex:We need to access categoryId from category router
const router = express.Router({mergeParams:true})
router.route('/').get(getSubCategories).post(createSubCategoryValidator,createSubCategory)
router.route('/:id').get(getSubCategoryValidator,getSubCategory).put(updateSubCategory,updateSubCategory).delete(deleteSubCategory,deleteSubCategory)


module.exports = router;