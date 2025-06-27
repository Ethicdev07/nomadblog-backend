const Comment = require("../models/commentmodel");
const Post = require("../models/postmodel");

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getComments = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ post: post._id })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting comments:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { addComment, getComments, deleteComment };
