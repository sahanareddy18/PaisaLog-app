import express from "express";
import cors from "cors";
import expensesRouter from "./routes/expenses.js";
import { initDatabase } from "./db.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Init DB
initDatabase();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

// Routes
app.use("/expenses", expensesRouter);

// Export for Vercel
export default app;