const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
dotenv.config({ path: 'config.env' })

//Start express app
const app = express()

//Start Body parser
app.use(express.json())

//Start middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

//connect with db
mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database Connect: ${conn.connection.host}`);
}).catch((err) => {
    console.error(`Data Error: ${err}`);
    process.exit(1); //Stop the node.js application
})

//Start to create Schema
const categorySchema = new mongoose.Schema({
    name: String,
})

//Create model on  dataBase
const categoryModel = mongoose.model('Category', categorySchema)

//Routes
app.post(('/'), (req, res) => {
    const name = req.body.name
    console.log(req.body);

    const newCategory = new categoryModel({ name })
    newCategory.save().then((doc) => {
        res.json(doc)
    }).catch((err) => {
        res.json(err)
    })
})

app.get('/', (req, res, next) => {
    res.send('ahmed samir')
})


//Start to listen the project
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`App running on port ${port}`))