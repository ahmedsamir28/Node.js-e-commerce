const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')

//Start express app
const app = express()
//Start Body parser
app.use(express.json())

dotenv.config({ path: 'config.env' })
const dbConnection = require('./Config/database')
const categoryRoute = require('./Routes/categoryRoute')
const ApiError = require('./Utils/apiError')
const globalError = require('./Middlewares/errorMiddleware')

dbConnection()


//Start middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use('/api/v1/categories', categoryRoute)

app.all('*', (req, res, next) => {
    //Create error and send it to error handling middleware
    // const err = new Error(`Can't find this route : ${req.originalUrl}`)
    // next(err.message)

    next(new ApiError(`Can't find this route : ${req.originalUrl}`,400))
})

//Global error handling middleware
app.use(globalError)

//Start to listen the project
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`App running on port ${port}`))