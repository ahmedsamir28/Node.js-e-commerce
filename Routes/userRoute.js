const express = require('express');
const { getUsers, uploadUserImage, resizeImage, createUser, getUser, updateUser, deleteUser, changeUserPassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserDate } = require('../Services/userService');
const { createUserValidator, getUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator, updateLoggedUserValidator } = require('../Utils/Validators/userValidator');

const authService = require('../Services/authService')

const router = express.Router();

router.use(authService.protect)

router.get('/getMe', getLoggedUserData, getUser)
router.put('/changeMyPassword', updateLoggedUserPassword)
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData)
router.delete('/deleteMe', updateLoggedUserValidator, deleteLoggedUserDate)

// Admin
router.use(authService.allowedTo('admin', 'manager'))
router.put('/change-password/:id', changeUserPasswordValidator, changeUserPassword)


router.route('/').get(getUsers).post(uploadUserImage, resizeImage, createUserValidator, createUser);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;
