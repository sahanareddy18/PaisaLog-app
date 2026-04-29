import express from "express";
import cors from "cors";
import expensesRouter from "./routes/expenses.js";
import pool from "./db.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend working" });
});

app.get("/health/db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, database: rows[0].ok === 1 ? "reachable" : "unknown" });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      code: error.code,
    });
  }
});

app.use("/expenses", expensesRouter);

export default app;
