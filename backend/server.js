import "dotenv/config";
import app from "./app.js";
import { initDatabase } from "./db.js";

const PORT = process.env.PORT || 3000;

initDatabase()
  .then(() => console.log("Database initialized"))
  .catch((err) => console.log("DB init note:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
