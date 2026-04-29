import "dotenv/config";
import mysql from "mysql2/promise";

let pool;

function getPool() {
  if (!process.env.MYSQL_URL) {
    throw new Error("MYSQL_URL environment variable is required");
  }

  if (!pool) {
    pool = mysql.createPool(process.env.MYSQL_URL);
  }

  return pool;
}

export async function initDatabase() {
  const connection = await getPool().getConnection();
  console.log("DB connected successfully");
  connection.release();
}

export default {
  execute(...args) {
    return getPool().execute(...args);
  },
  getConnection(...args) {
    return getPool().getConnection(...args);
  },
};
