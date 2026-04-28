import mysql from "mysql2/promise";

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function initDatabase() {
  try {
    await pool.execute("SELECT 1");
    console.log("✅ DB Connected Successfully");
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
  }
}

export default pool;