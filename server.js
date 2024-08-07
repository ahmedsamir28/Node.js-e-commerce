const path = require('path')

const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')


dotenv.config({ path: 'config.env' })
const ApiError = require('./Utils/apiError')
const globalError = require('./Middlewares/errorMiddleware')
const dbConnection = require('./Config/database')

//Routes 
const mountRoutes = require('./Routes')
const { webhookCheckout } = require('./Services/orderService')

//Connect with db
dbConnection()

//Start express app
const app = express()

//Enable others domains to assess your application 
app.use(cors())
app.options('*', cors())

// compress all responses
app.use(compression())

// Checkout webhook 
app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    webhookCheckout
)

//Start Body parser
app.use(express.json())

app.use(express.static(path.join(__dirname, 'uploads')))

//Start middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app)

app.all('*', (req, res, next) => {
    //Create error and send it to error handling middleware
    // const err = new Error(`Can't find this route : ${req.originalUrl}`)
    // next(err.message)
    next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400))
})

//Global error handling middleware for express
app.use(globalError)
//Start to listen the project
const port = process.env.PORT || 8000
const server = app.listen(port, () => console.log(`App running on port ${port}`))

// Handel rejection outside express
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error('Shutting down ....');
        process.exit(1); //Stop the node.js application
    })
})
