import "dotenv/config";
import app from "./app.js";
import { initDatabase } from "./db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error.message);
    process.exit(1);
  }
}

startServer();