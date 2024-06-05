const mongoose = require('mongoose')

const dbConnection = () => {
    mongoose.connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`Database Connect: ${conn.connection.host}`);
        }).catch((err) => {
            console.error(`Data Error: ${err}`);
            process.exit(1); //Stop the node.js application
        })
}

module.exports = dbConnection