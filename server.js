const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
dotenv.config({path: 'config.env'})

const app = express()

// connect with db
mongoose.connect(process.env.DB_URI).then((conn)=>{
    console.log(`Database Connect: ${conn.connection.host}`);
}).catch((err)=>{
    console.error(`Data Error: ${err}`);
    process.exit(1); //Stop the node.js application
})


if (process.env.NODE_ENV ==='development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

app.get('/',(req,res,next)=> {
    res.send('ahmed samir')
})


const port = process.env.PORT || 8000   
app.listen(port, ()=> console.log(`App running on port ${port}`))