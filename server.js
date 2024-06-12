const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')

dotenv.config({ path: 'config.env' })
const dbConnection = require('./Config/database')
const categoryRoute = require('./Routes/categoryRoute')

dbConnection()
//Start express app
const app = express()

//Start Body parser
app.use(express.json())

//Start middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use('/api/v1/categories',categoryRoute)

//Start to listen the project
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`App running on port ${port}`))