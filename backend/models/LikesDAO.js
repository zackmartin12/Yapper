const db = require('../db/db');

module.exports = {
    getLikeCount: (yapId) => {
        return db.query(`
            SELECT * 
            FROM likes 
            WHERE yap_id = ?`, 
            [yapId]
        ).then(([rows]) => {
            return rows.length;
        });
    },

    getLikeStatus: (yapId, userId) => {
        return db.query(`
            SELECT * 
            FROM likes 
            WHERE yap_id = ? AND user_id = ?`, 
            [yapId, userId]
        ).then(([rows]) => {
            return rows.length > 0;
        });
    },

    likeYap: (yapId, userId) => {
        return db.query(`
            INSERT INTO likes (yap_id, user_id) 
            VALUES (?, ?)`, 
            [yapId, userId]
        ).then(() => {
            return module.exports.getLikeCount(yapId);
        });
    },    

    unlikeYap: (yapId, userId) => {
        return db.query(`
            DELETE FROM likes 
            WHERE yap_id = ? AND user_id = ? `, 
            [yapId, userId]
        ).then(() => {
            return module.exports.getLikeCount(yapId);
        });
    }
};
