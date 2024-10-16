const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res) => {
  const authorId = req.id;
  const authorAccountType = req.accountType;

  if (authorAccountType == "buyer") {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden, only sellers can post" });
  }

  const { title, author, price, image, publicId } = req.body;

  try {
    const post = new Post({
      title,
      author,
      price,
      image,
      publicId,
      authorId,
    });
    await post.save();
    await User.findByIdAndUpdate(authorId, {
      $push: { uploads: post._id },
    });

    return res
      .status(201)
      .json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found" });
    }

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyPosts = async (req, res) => {
  const authorId = req.id;
  const authorAccountType = req.accountType;

  try {
    // Find the user by ID and populate the purchased posts

    if (authorAccountType === "Buyer") {
      const { purchased } = await User.findById(authorId).populate("purchased");
      console.log(purchased);
      if (!purchased) {
        return res
          .status(404)
          .json({ success: false, message: "No posts found" });
      }

      return res.status(200).json({ success: true, data: purchased });
    } else {
      const { uploads } = await User.findById(authorId).populate("uploads");

      if (!uploads) {
        return res
          .status(404)
          .json({ success: false, message: "No uploads found" });
      }

      return res.status(200).json({ success: true, data: uploads });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await post.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "post not found" });
    }

    const { authorId } = post;

    await User.findByIdAndUpdate(authorId, {
      $pull: { uploads: id },
    });
    // //we will not do this as some of the people had already purchased your asset
    // await Post.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const searchPost = async (req, res) => {
  const { search } = req.query;

  try {
    const posts = await Post.find({ title: { $regex: search, $options: "i" } });
    if (posts.length == 0)
      return res
        .status(404)
        .json({ success: false, message: "no posts found" });

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addToFavourites = async (req, res) => {
  const { authorId } = req.id;

  const { postId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(authorId, {
      $push: { favourites: postId },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({ success: true, message: "Post added to favourites" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromFavourites = async (req, res) => {
  const { authorId } = req.id;

  const { postId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(authorId, {
      $pull: { favourites: postId },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({ success: true, message: "Post removed to favourites" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getFavourites = async (req, res) => {
  const authorId = req.id;

  try {
    const { favourites } = await User.findById(authorId).populate("favourites");

    if (!favourites)
      return res
        .status(404)
        .json({ success: false, message: "No favourites found" });

    return res.status(200).json({ success: true, data: favourites });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPostsByDateRange = async (req, res) => {
  const authorId = req.id;
  const authorAccountType = req.accountType;

  let data;

  try {
    if (authorAccountType === "buyer") {
      const { purchased } = await User.findById(authorId).populate("purchased");
      console.log(purchased);
      data = purchased;
    } else {
      const { uploads } = await User.findById(authorId).populate("uploads");
      console.log(uploads);
      data = uploads;
    }

    if (!data) {
      return res.status(500).json({ success: false, message: "Nothing found" });
    }

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    

    const postsThisYear = data.filter(
      (post) => new Date(post.createdAt) >= startOfYear
    );
    const postsThisMonth = data.filter(
      (post) => new Date(post.createdAt) >= startOfMonth
    );
    const postsThisWeek = data.filter(
      (post) => new Date(post.createdAt) >= startOfWeek
    );

    console.log("Posts this week:", postsThisWeek);
    console.log("Posts this month:", postsThisMonth);
    console.log("Posts this year:", postsThisYear);

    return res.status(200).json({
      success: true,
      data: {
        tillNow: data,
        thisYear: postsThisYear,
        thisMonth: postsThisMonth,
        thisWeek: postsThisWeek,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  deletePost,
  searchPost,
  addToFavourites,
  removeFromFavourites,
  getFavourites,
  getPostsByDateRange,
};
