import express from "express";
import cors from "cors";
import expensesRouter from "./routes/expenses.js";
import { initDatabase } from "./db.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Initialize DB (creates table if not exists)
initDatabase();

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

// Routes
app.use("/expenses", expensesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;