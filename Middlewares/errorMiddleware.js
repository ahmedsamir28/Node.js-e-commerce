// const ApiError = require("../Utils/apiError");


const sendErrorForDev = (err,res) =>{
    return res.status(err.statusCode).json({ 
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorForProd = (err,res) => {
    return res.status(err.statusCode).json({ 
        status: err.status,
        message: err.message,
    })
}

const handleJwtInvalidSignature = ()=>[
new ApiError('Invalid token ,please login again...',401)
]

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (process.env.NODE_ENV ==='development') {
        sendErrorForDev(err,res)
    } else {
        if (err.name == 'JsonWebTokenError') handleJwtInvalidSignature()
        sendErrorForProd(err,res)
    }
}

module.exports = globalError