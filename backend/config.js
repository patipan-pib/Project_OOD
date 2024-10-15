// config.js
const mysql = require('mysql2/promise');

const createConnection = () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'my_database',
        waitForConnections: true,
        queueLimit: 0
    });

    return pool;
};

module.exports = { createConnection };
