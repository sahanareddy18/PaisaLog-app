import express from "express";
import cors from "cors";
import expensesRouter from "./routes/expenses.js";
import { initDatabase } from "./db.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Initialize DB without blocking (handle gracefully)
initDatabase().then(() => {
  console.log("✅ Database initialized");
}).catch(err => {
  console.log("⚠️ DB init note:", err.message);
});

app.get("/", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

app.use("/expenses", expensesRouter);

export default app;