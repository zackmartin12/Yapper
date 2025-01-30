const express = require('express');
const router = express.Router();
const LikesDAO = require('../models/LikesDAO');
const { TokenMiddleware } = require('../middleware/TokenMiddleware');

router.get('/:yapId/count', TokenMiddleware, (req, res) => {
    const yapId = parseInt(req.params.yapId);

    LikesDAO.getLikeCount(yapId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.get('/:yapId/:userId', TokenMiddleware, (req, res) => {
    const yapId = parseInt(req.params.yapId);
    const userId = parseInt(req.params.userId);

    LikesDAO.getLikeStatus(yapId, userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.post('/:yapId', TokenMiddleware, (req, res) => {
    const yapId = parseInt(req.params.yapId);
    const userId = parseInt(req.body.userId);

    LikesDAO.likeYap(yapId, userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.delete('/:yapId/:userId', TokenMiddleware, (req, res) => {
    const yapId = parseInt(req.params.yapId);
    const userId = parseInt(req.params.userId);

    LikesDAO.unlikeYap(yapId, userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

module.exports = router;