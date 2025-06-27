const Post = require("../models/postmodel");
const slugify = require('slugify');
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary")

const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    let imageUrl = '';

    if (req.file) {
      const streamUpload = (req) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "blog-posts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload(req);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const post = await Post.create({
      title,
      content,
      tags: tags?.split(',') || [],
      image:imageUrl,
      imagePublicId,    
      author: req.user._id,
      slug: slugify(title, {lower: true}),
    });
    res.status(201).json(post);
  } catch (error) {
    console.log("error creating blog", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) 
      .populate("author", "username email");

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    console.log("Error fetching Allblogs", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("author", "username");

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.log("Error fetching blog by slug", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


const updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });


    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      post.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized to update post" });
    }

    const { title, content, tags } = req.body;

    if (title) {
      post.title = title;
      post.slug = slugify(title, { lower: true });
    }

    if (content) post.content = content;
    if (tags) post.tags = tags.split(',');

    if (req.file) {
      const streamUpload = (req) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "blog-posts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload(req);
      post.image = result.secure_url;
    }

    const updated = await post.save();
    res.status(200).json(updated);
  } catch (error) {
    console.log("Error updating Post", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (
      post.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost
};
