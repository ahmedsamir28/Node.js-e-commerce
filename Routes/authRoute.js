const express = require('express');
const { signup, login } = require('../Services/authService');
const { signUpValidator, loginValidator } = require('../Utils/Validators/authValidator');

const router = express.Router();
router.route('/signup').post(signUpValidator,signup);
router.route('/login').post(loginValidator,login);


// router.route('/:id')
//     .get(getUserValidator, getUser)
//     .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//     .delete(deleteUserValidator, deleteUser);

module.exports = router;
