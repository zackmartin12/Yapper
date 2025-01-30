require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

exports.getDatabaseConnection = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
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