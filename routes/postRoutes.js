const {
  createPost,
  getAllPosts,
  getMyPosts,
  deletePost,
  searchPost,
  addToFavourites,
  removeFromFavourites,
  getFavourites,
} = require("../controllers/postController");
const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/post/create", verifyToken, createPost);
router.get("/post/getAll", getAllPosts);
router.get("/post/myPosts", verifyToken, getMyPosts);
router.delete("/post/delete/:id", verifyToken, deletePost);
router.get("/posts/search", searchPost);
router.post("/post/addToFavourites/:postId", verifyToken, addToFavourites);
router.post(
  "/post/removeFromFavourites/:postId",
  verifyToken,
  removeFromFavourites
);
router.get("/posts/favourites", verifyToken, getFavourites);

module.exports = router;
