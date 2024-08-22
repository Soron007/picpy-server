const express = require('express');
const app = express();
const dotenv = require('dotenv')
const { readdirSync } = require("fs");
const { connectDb } = require('./connection');
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 5000;

connectDb();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("<center><h2>Server running boys.....</h2></center>")
})

readdirSync("./routes").map((route) =>
    app.use("/api", require(`./routes/${route}`))
)



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})