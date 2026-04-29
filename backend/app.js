import express from "express";
import cors from "cors";
import expensesRouter from "./routes/expenses.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend working" });
});

app.use("/expenses", expensesRouter);

export default app;
