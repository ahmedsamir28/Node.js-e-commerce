const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

//Start express app
const app = express()
//Start Body parser
app.use(express.json())

dotenv.config({ path: 'config.env' })
const dbConnection = require('./Config/database')
const categoryRoute = require('./Routes/categoryRoute')
const subCategoryRoute = require('./Routes/subCategoryRoute')
const ApiError = require('./Utils/apiError')
const globalError = require('./Middlewares/errorMiddleware')

dbConnection()


//Start middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use('/api/v1/categories', categoryRoute)
app.use('/api/v1/subcategories', subCategoryRoute)

app.all('*', (req, res, next) => {
    //Create error and send it to error handling middleware
    // const err = new Error(`Can't find this route : ${req.originalUrl}`)
    // next(err.message)

    next(new ApiError(`Can't find this route : ${req.originalUrl}`,400))
})

//Global error handling middleware for express
app.use(globalError)

//Start to listen the project
const port = process.env.PORT || 8000
const server = app.listen(port, () => console.log(`App running on port ${port}`))

// Handel rejection outside express
process.on('unhandledRejection',(err)=>{
    console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
server.close(()=>{
    console.error('Shutting down ....');
    process.exit(1); //Stop the node.js application
})
})