const jwt = require("jsonwebtoken");

const userModel = require("../Models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs/dist/bcrypt");
const ApiError = require("../Utils/apiError");
const { token } = require("morgan");

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

exports.protect = asyncHandler(async (req, res, next) => {
    // 1) check if token exist , if exist get 
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        console.log(token);
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


