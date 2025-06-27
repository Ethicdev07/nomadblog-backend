const express = require('express');
const router = express.Router();
const { toggleLike, getLikeCount } = require('../controllers/likecontroller');
const { protect } = require('../middlewares/authMiddleware');

router.post('/:slug/like', protect, toggleLike);
router.get('/:slug/likes', getLikeCount);

module.exports = router;
