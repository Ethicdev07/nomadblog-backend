const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} = require('../controllers/postcontroller');

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/', protect, upload.single('image'), createPost);
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.put('/:slug', protect, upload.single('image'), updatePost);
router.delete('/:slug', protect, deletePost);

module.exports = router;
