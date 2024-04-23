const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://ayon00:ayon00@cluster0.uaxqlv1.mongodb.net/Cluster0'

mongoose.connect(mongoURL, {useUnifiedTopology: true, useNewUrlParser: true})

var connection = mongoose.connection
connection.on('error', () =>{
    console.log('MongoDB Connection Failed')
})

connection.on('connected', () =>{
    console.log('MongoDB Connection Successful')
})

module.exports = mongoose