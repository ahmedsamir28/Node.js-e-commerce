const express = require('express');
const { getUsers, uploadUserImage, resizeImage, createUser, getUser, updateUser, deleteUser, changeUserPassword } = require('../Services/userService');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator } = require('../Utils/Validators/userValidator');

const router = express.Router();
router.put('/change-password/:id',changeUserPasswordValidator,changeUserPassword)
router.route('/').get(getUsers).post(uploadUserImage, resizeImage, createUserValidator, createUser);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;
