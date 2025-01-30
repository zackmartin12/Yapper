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
    getFollowing: (userId) => {
        return db.query(`
            SELECT users.* 
            FROM users 
            JOIN follows ON users.user_id = follows.following_id 
            WHERE follows.follower_id = ?`, 
            [userId]
        ).then(([rows]) => {
            return rows.map(user => getFilteredUser(user));
        });
    },

    getFollowingCount: (userId) => {
        return db.query(`
            SELECT * 
            FROM follows 
            WHERE follower_id = ?`, 
            [userId]
        ).then(([rows]) => {
            return rows.length;
        });
    },

    getFollowingStatus: (userId, targetUserId) => {
        return db.query(`
            SELECT * 
            FROM follows 
            WHERE follower_id = ? AND following_id = ?`, 
            [userId, targetUserId]
        ).then(([rows]) => {
            return rows.length > 0;
        });
    },

    followUser: (userId, targetUserId) => {
        return db.query(`
            INSERT INTO follows (follower_id, following_id) 
            VALUES (?, ?)`, 
            [userId, targetUserId]
        ).then(() => {
            return module.exports.getFollowingCount(userId);
        });
    },    

    unfollowUser: (userId, targetUserId) => {
        return db.query(`
            DELETE FROM follows 
            WHERE follower_id = ? AND following_id = ?`, 
            [userId, targetUserId]
        ).then(() => {
            return module.exports.getFollowingCount(userId);
        });
    }
};
