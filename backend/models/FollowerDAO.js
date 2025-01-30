const db = require('../db/db');

function getFilteredUser(user) {
    return {
        "user_id": user.user_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username
    }
}

module.exports = {
    getFollowers: (userId) => {
        return db.query(`
            SELECT users.* 
            FROM users 
            JOIN follows ON users.user_id = follows.follower_id 
            WHERE follows.following_id = ?`, 
            [userId]
        ).then(([rows]) => {
            return rows.map(user => getFilteredUser(user));
        });
    },

    getFollowerCount: (userId) => {
        return db.query(`
            SELECT * 
            FROM follows 
            WHERE following_id = ?`, 
            [userId]
        ).then(([rows]) => {
            return rows.length;
        });
    }
};
