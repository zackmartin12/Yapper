const express = require('express');
const router = express.Router();
const FollowingDAO = require('../models/FollowingDAO');
const { TokenMiddleware } = require('../middleware/TokenMiddleware');

router.get('/:userId', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    FollowingDAO.getFollowing(userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.get('/:userId/count', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    FollowingDAO.getFollowingCount(userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.get('/:userId/:targetUserId', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);
    const targetUserId = parseInt(req.params.targetUserId);

    FollowingDAO.getFollowingStatus(userId, targetUserId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.post('/:userId', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);
    const targetUserId = parseInt(req.body.targetUserId);

    FollowingDAO.followUser(userId, targetUserId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.delete('/:userId/:targetUserId', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);
    const targetUserId = parseInt(req.params.targetUserId);

    FollowingDAO.unfollowUser(userId, targetUserId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

module.exports = router;