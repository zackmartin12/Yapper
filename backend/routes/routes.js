const express = require('express');
const router = express.Router();

const authRoutes = require('../controllers/AuthController');
const userRoutes = require('../controllers/UserController');
const yapRoutes = require('../controllers/YapsController');
const likeRoutes = require('../controllers/LikesController');
const followingRoutes = require('../controllers/FollowingController');
const followerRoutes = require('../controllers/FollowerController');

router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/yaps', yapRoutes);
router.use('/api/likes', likeRoutes);
router.use('/api/following', followingRoutes);
router.use('/api/follower', followerRoutes);

module.exports = router;
