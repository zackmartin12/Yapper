const db = require('../db/db');
const crypto = require('crypto');

function getFilteredUser(user) {
    return {
        "user_id": user.user_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username
    }
}

module.exports = {
    registerUser: (firstName, lastName, username, password) => {
        const salt = crypto.randomBytes(32).toString('hex');
        const passwordHash = crypto
            .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
            .toString('hex');

        return db.query(`
            INSERT INTO users (first_name, last_name, username, salt, password) 
            VALUES (?, ?, ?, ?, ?)`,
            [firstName, lastName, username, salt, passwordHash]
        ).then(() => {
            return "User registered succesfully";
        });
    },

    authenticateUser: (username, password) => {
        return db.query(`
            SELECT *
            FROM users 
            WHERE username = ?`, 
            [username]
        ).then(([rows]) => {
            const user = rows[0];
            return new Promise((resolve) => {
                crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', (err, derivedKey) => {
                    const digest = derivedKey.toString('hex');
                    if (user.password === digest) {
                        resolve(getFilteredUser(user));
                    } else {
                        return "Error";
                    }
                });
            });
        });
    }
}