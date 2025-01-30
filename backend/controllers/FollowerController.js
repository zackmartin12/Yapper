const express = require('express');
const router = express.Router();
const FollowerDAO = require('../models/FollowerDAO');
const { TokenMiddleware } = require('../middleware/TokenMiddleware');

router.get('/:userId', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    FollowerDAO.getFollowers(userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.get('/:userId/count', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    FollowerDAO.getFollowerCount(userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

module.exports = router;