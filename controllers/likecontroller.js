const Like = require("../models/likemodel");
const Post = require("../models/postmodel");

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existing = await Like.findOne({
      post: post._id,
      user: req.user._id,
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ message: "Post unliked" });
    }

    const like = await Like.create({
      post: post._id,
      user: req.user._id,
    });

    res.status(201).json({ message: "Post liked", like });
  } catch (error) {
    console.error("Error toggling like:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getLikeCount = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const count = await Like.countDocuments({ post: post._id });

    res.status(200).json({ likes: count });
  } catch (error) {
    console.error("Error fetching like count:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { toggleLike, getLikeCount };
