

const { login, signup, refreshToken, switchProfile } = require("../controllers/authController");
const verifyToken = require('../middleware/verifyToken')

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.get("/switch", verifyToken, switchProfile);

module.exports = router;