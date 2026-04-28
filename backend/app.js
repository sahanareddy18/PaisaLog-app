import express from "express";
import cors from "cors";
import expensesRouter from "./routes/expenses.js";
import { initDatabase } from "./db.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Wait for DB before handling requests
let dbReady = false;

initDatabase().then(() => {
  dbReady = true;
  console.log("DB Ready ✅");
});

// Middleware to block requests until DB ready
app.use((req, res, next) => {
  if (!dbReady) {
    return res.status(503).json({ error: "Server starting, try again" });
  }
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

app.use("/expenses", expensesRouter);

export default app;