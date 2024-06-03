const express = require("express")
const dotenv = require("dotenv")
dotenv.config({path: 'config.env'})
const app = express()


app.get('/',(req,res,next)=> {
    res.send('ahmed sarmi')
})


const port = process.env.PORT || 8000   
app.listen(port, ()=> console.log(`App running on port ${port}`))