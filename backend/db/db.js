const mysql = require('mysql2/promise');

let pool;

exports.getDatabaseConnection = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "yapper"
        });
    }
    return pool;
}

exports.query = (query, params = []) => {
    const pool = exports.getDatabaseConnection();
    return pool.query(query, params).catch(err => {
        console.error(err);
        throw err;
    });
}

exports.close = () => {
    if (pool !== null) {
        pool.end();
        pool = null;
    }
}