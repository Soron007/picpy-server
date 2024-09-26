// Ye hai aam zindagi
// const express = require("express")
// const router = express.Router()

const { login, signup, refreshToken } = require("../controllers/authController");

// Ye hai mentos zindagi
const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refreshToken);

module.exports = router;