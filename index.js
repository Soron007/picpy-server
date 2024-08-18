//4 steps to make a server

//call express in a variable, define the port
const express = require('express');
//listen to the server
//Making routes
const app = express();
const dotenv = require('dotenv')
dotenv.config();

const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send("<center><h2>Server running boys.....</h2></center>")
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})