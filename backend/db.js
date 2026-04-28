import mysql from "mysql2/promise";

const pool = mysql.createPool(process.env.MYSQL_URL);

export async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ DB Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ DB CONNECTION FAILED:", err.message);
  }
}

export default pool;