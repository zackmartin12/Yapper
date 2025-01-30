const express = require('express');
const router = express.Router();
const UserDAO = require('../models/UserDAO');
const { TokenMiddleware } = require('../middleware/TokenMiddleware');

router.get('/:userId', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);

    UserDAO.getUser(userId).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.put('/:userId', TokenMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);
    const { firstName, lastName, username } = req.body;

    UserDAO.updateUser(userId, firstName, lastName, username).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

router.get('/search/:query', TokenMiddleware, (req, res) => {
    const query = req.params.query;

    UserDAO.searchUsers(query).then(data => {
        res.json(data);
    }).catch(() => {
        res.status(404).json();
    });
});

module.exports = router;