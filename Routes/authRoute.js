const express = require('express');
const { signup, login, forgotPassword, verifyPasswordResetCode, resetPassword } = require('../Services/authService');
const { signUpValidator, loginValidator } = require('../Utils/Validators/authValidator');

const router = express.Router();

router.post('/signup', signUpValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPasswords', forgotPassword);
router.post('/verifyResetCode', verifyPasswordResetCode);
router.put('/resetPassword', resetPassword);




// router.route('/:id')
//     .get(getUserValidator, getUser)
//     .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//     .delete(deleteUserValidator, deleteUser);

module.exports = router;
