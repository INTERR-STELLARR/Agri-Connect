const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "interstellar", // Ensure this matches your MySQL password
  database: "agri_connect",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export connection pool with promises
module.exports = pool.promise();
