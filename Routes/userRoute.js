const express = require('express');
const { getUsers, uploadUserImage, resizeImage, createUser, getUser, updateUser, deleteUser, changeUserPassword } = require('../Services/userService');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator } = require('../Utils/Validators/userValidator');

const authService = require('../Services/authService')

const router = express.Router();
router.put('/change-password/:id', changeUserPasswordValidator, changeUserPassword)
router.route('/').get(getUsers).post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadUserImage, resizeImage, createUserValidator, createUser);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteUserValidator, deleteUser);

module.exports = router;
