require("dotenv").config();

const mysql = require('mysql2/promise');
const fs = require("fs");

const isRunningInDocker = fs.existsSync("/.dockerenv");
const dbHost = isRunningInDocker
  ? (process.env.DB_CONTAINER || process.env.MYSQL_HOST || "localhost")
  : (process.env.MYSQL_HOST || "localhost");

const config = {
  db: { /* do not put password or any sensitive info here, done only for demo */
    host: dbHost,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
  },
};
  
const pool = mysql.createPool(config.db);

// Utility function to query the database
async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);

  return rows;
}

module.exports = {
  query,
}