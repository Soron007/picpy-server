

const express = require("express");

const router = express.Router();

router.get('/hello', (req, res)=>{
    res.json({
         message: "Hello",
         name: "Souvik",
    })
})


module.exports = router;


