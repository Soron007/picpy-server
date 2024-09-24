// const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    purchasedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
