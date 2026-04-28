import mysql from "mysql2/promise";

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
});

export async function initDatabase() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amount INT NOT NULL,
      category VARCHAR(100),
      description TEXT,
      date DATE,
      idempotency_key VARCHAR(255) UNIQUE
    )
  `);
}

export default pool;