const express = require('express');
const router = express.Router();
const AuthDAO = require('../models/AuthDAO');
const { generateToken, removeToken, TokenMiddleware } = require('../middleware/TokenMiddleware');

router.post('/register', (req, res) => {
    const {firstName, lastName, username, password } = req.body;
    if (firstName && lastName && username && password) {
        AuthDAO.registerUser(firstName, lastName, username, password).then(data => {
            res.json(data);
        }).catch(err => {
            res.status(err.code || 500).json({ error: err.message || "Internal server error." });
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        AuthDAO.authenticateUser(username, password).then(data => {
            generateToken(req, res, data);
            res.json({ data: data });
        }).catch(() => {
            res.status(404).json();
        });
    } else {
        res.status(400).json();
    }
});

router.post('/logout', (req, res) => {
    removeToken(req, res);
    res.json({ success: true} );
});

router.get('/current', TokenMiddleware, (req, res) => {
    res.json(req.user);
});

module.exports = router;