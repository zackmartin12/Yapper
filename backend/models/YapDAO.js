const db = require('../db/db');

module.exports = {
    getUserYaps: (userId) => {
        return db.query(`
            SELECT * 
            FROM yaps 
            WHERE user_id = ? 
            ORDER BY datetime DESC`, 
            [userId]
        ).then(([rows]) => {
            return rows;
        });
    },

    getFollowedUserYaps: (userId) => {
        return db.query(`
            SELECT yaps.* 
            FROM yaps 
            JOIN follows ON yaps.user_id = follows.following_id 
            WHERE follows.follower_id = ? 
            ORDER BY yaps.datetime DESC`, 
            [userId]
        ).then(([rows]) => {
            return rows;
        });
    },

    getYapFeed: (userId) => {
        return Promise.all([
            module.exports.getUserYaps(userId),
            module.exports.getFollowedUserYaps(userId)
        ]).then(([userYaps, followedYaps]) => {
            const combinedYaps = [...userYaps, ...followedYaps];
            combinedYaps.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
            return combinedYaps;
        });
    },

    createYap: (userId, text) => {
        return new Promise((resolve) => {
            const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            return db.query(`
                INSERT INTO yaps (user_id, datetime, text) 
                VALUES (?, ?, ?)`,
                [userId, datetime, text]
            ).then(([result]) => {
                const yapId = result.insertId;
                return db.query(`
                    SELECT * 
                    FROM yaps 
                    WHERE yap_id = ?`, 
                    [yapId]
                ).then(([rows]) => {
                    resolve(rows[0]); 
                });
            });
        });
    }
};
