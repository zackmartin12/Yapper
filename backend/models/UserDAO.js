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
    getUser: (userId) => {
        return db.query(`
            SELECT * 
            FROM users 
            WHERE user_id = (?)`, 
            [userId]
        ).then(([rows]) => {
            return getFilteredUser(rows[0]);
        })
    },

    updateUser: (userId, firstName, lastName, username) => {
        const updates = [];
        const values = [];
    
        if (firstName) {
            updates.push("first_name = ?");
            values.push(firstName);
        }
        if (lastName) {
            updates.push("last_name = ?");
            values.push(lastName);
        }
        if (username) {
            updates.push("username = ?");
            values.push(username);
        }
        values.push(userId);
    
        return db.query(`
            UPDATE users 
            SET ${updates.join(", ")} 
            WHERE user_id = ?`, 
            values
        ).then(() => {
            return module.exports.getUser(userId);
        });
    },
    
    searchUsers: (query) => {
        return db.query(`
            SELECT * 
            FROM users 
            WHERE username LIKE ? LIMIT 3`, 
            [`${query}%`]
        ).then(([rows]) => {
            return rows.map(getFilteredUser);
        });
    }
};
