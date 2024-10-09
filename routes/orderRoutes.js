const {getOrders} = require("../controllers/orderController");

const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/orders/get", verifyToken, getOrders);

module.exports = router;
