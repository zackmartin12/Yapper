const express = require('express');
const router = express.Router();
const YapDAO = require('../models/YapDAO');
const { TokenMiddleware } = require('../middleware/TokenMiddleware');

router.post('/', TokenMiddleware, (req, res) => {
    const { userId, text } = req.body;

    YapDAO.createYap(userId, text).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.get('/:userId', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    YapDAO.getUserYaps(userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.get('/:userId/follows', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    YapDAO.getFollowedUserYaps(userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.get('/:userId/feed', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    YapDAO.getYapFeed(userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    })
});

module.exports = router;