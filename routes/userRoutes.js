const express = require('express');
const router = express.Router();

const {getUserProfile, updateUserProfile, getAllUsers, deleteUser} = require('../controllers/usercontroller');

const {protect, admin} = require('../middlewares/authMiddleware');


router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

//admin

router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);


module.export = router;



