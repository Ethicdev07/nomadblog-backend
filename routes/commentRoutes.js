const express = require('express');
const router = express.Router();
const { addComment, getComments, deleteComment } = require('../controllers/commentcontroller');
const { protect } = require('../middlewares/authMiddleware');

router.post('/:slug/comments', protect, addComment);
router.get('/:slug/comments', getComments);
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;
