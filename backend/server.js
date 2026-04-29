import "dotenv/config";
import app from "./app.js";
import { initDatabase } from "./db.js";

const PORT = process.env.PORT || 3000;

// Initialize DB but don't block server start
initDatabase()
  .then(() => console.log("✅ Database initialized"))
  .catch(err => console.log("⚠️ DB init note:", err.message));

// For Vercel: export the Express app as a serverless function
// For local: start the server
if (process.env.VERCEL === "1") {
  module.exports = app;
} else {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}