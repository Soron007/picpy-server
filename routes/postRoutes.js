const { createPost, getAllPosts, getMyPosts } = require("../controllers/postController");
const verifyToken = require("../middleware/verifyToken")

const router = require("express").Router();



router.post("/post/create", verifyToken, createPost);
router.get("/post/getAll", getAllPosts);
router.get("/post/myPosts", verifyToken, getMyPosts)

module.exports = router;