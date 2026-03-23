require("dotenv").config();

const mysql = require('mysql2/promise');

const dbHost = process.env.DB_HOST || process.env.DB_CONTAINER || "db";
const dbPort = Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306);
const dbUser = process.env.DB_USER || process.env.MYSQL_ROOT_USER || process.env.MYSQL_USER || "root";
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.MYSQL_PASS || "";
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE;

const config = {
  db: { /* do not put password or any sensitive info here, done only for demo */
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
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