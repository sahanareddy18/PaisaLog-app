import mysql from 'mysql2/promise';

function getDbConfig() {
  const hasDiscreteConfig =
    process.env.MYSQL_HOST ||
    process.env.MYSQL_USER ||
    process.env.MYSQL_PASSWORD ||
    process.env.MYSQL_DATABASE ||
    process.env.MYSQL_PORT;

  if (hasDiscreteConfig) {
    return {
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'expense_tracker',
      port: Number(process.env.MYSQL_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }

  if (process.env.MYSQL_URL) {
    return process.env.MYSQL_URL;
  }

  return {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'expense_tracker',
    port: Number(process.env.MYSQL_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

const pool = mysql.createPool(getDbConfig());

export async function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amount INT NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      idempotency_key VARCHAR(255) UNIQUE,
      INDEX idx_category (category),
      INDEX idx_date (date)
    )
  `;

  await pool.execute(createTableQuery);
}

export default pool;