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
  try {
    await pool.execute("SELECT 1"); // test connection
    console.log("✅ DB Connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
}

export default pool;