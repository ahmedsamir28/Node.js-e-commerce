const crypto = require("crypto")

const userModel = require("../Models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs/dist/bcrypt");
const ApiError = require("../Utils/apiError");
const sendEmail = require("../Utils/sendEmail");
const jwt = require("jsonwebtoken");

const createToken = (payload) =>
    jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_SECRET_TIME
    })

exports.signup = asyncHandler(async (req, res, next) => {
    const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    // 2-Generate token
    const token = createToken(user._id)

    res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401))
    }
    // 2-Generate token
    const token = createToken(user._id)

    res.status(200).json({ data: user, token });
});

// Make sure this  user si logged in 
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) check if token exist , if exist get 
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(
            new ApiError(
                'you are not login , please to get access this route',
                401
            )
        )
    }

    // 2) Verify token (no change happens , expired token )
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // 3)Check if user exists
    const currentUser = await userModel.findById(decoded.userId)
    if (!currentUser) {
        return next(
            new ApiError(
                'The user that belong to this token does no longer exist',
                401
            )
        )
    }

    // 4) check if user change his password  after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimesTamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000, 10
        )
        //password changed after token created (Error)
        if (passChangedTimesTamp > decoded.iat) {
            return next(
                new ApiError(
                    'User recently changed his password. please  login again...', 401
                )
            )
        }
    }
    req.user = currentUser
    next()
})

//Authorization (user permissions)
// ["admin","manager"]
exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        // 1) access roles 
        // 2) access register user (req.user.role)
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError('You are not allowed to access this route', 403)
            )
        }
        next()
    })


exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user by email
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(
            new ApiError(`there is no user with that email ${req.body.email}`, 404)
        )
    }
    // 2) If user exist, Generate hash reset random 6 digits and save it in db 
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const hashResetCode = crypto.
        createHash('sha256')
        .update(resetCode)
        .digest('hex')

    // Save hashed password  reset code into db
    user.passwordResetCode = hashResetCode
    // Add expiration time for password reset  code (10 min)    
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000
    user.passwordResetVerified = false

    await user.save()

    const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account.\n${resetCode}\n
        Enter this code to complete reset \n Thanks for helping us keep your account  secure \n the E-shop team `
    // 3) Send the reset code via email

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 min)',
            message
        })
    } catch (err) {
        user.passwordResetCode = undefined
        user.passwordResetExpires = undefined
        user.passwordResetVerified = undefined

        await user.save()
        return next(new ApiError('There is an error sending email', 500))
    }
    res.status(200).json({ status: 'Success', message: 'Reset code sent to email' })
})

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
    // 1) Get user based  in reset code 
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex')
    const user = await userModel.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: data.now() },
    })
    if (!user) {
        return next(new ApiError('Reset code  invalid or expired'))
    }
    // 2) Reset code valid 
    userModel.passwordResetVerified = true
    await userModel.save()

    res.status(200).json({ status: 'Success' })
})

exports.resetPassword = asyncHandler(async (req, res, next) => {
    // 1)Get user based on email 
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(
            new ApiError(`There is no user with email ${req.body.email}`, 404)
        )
    }
    //2) Check if reset  code verified 
    if (!user.passwordResetVerified) {
        return next(new ApiError('Reset code not verified', 400))
    }

    user.password = req.body.newPassword
    user.passwordResetCode = undefined
    user.passwordResetExpires = undefined
    user.passwordResetVerified = undefined

    await user.save()

    // 3) If everything is ok ,generate token 
    const token = createToken(user._id)
    res.status(200).json({ token })
})