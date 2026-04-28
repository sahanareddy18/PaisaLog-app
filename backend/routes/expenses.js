import express from 'express';
import pool from '../db.js';

const router = express.Router();
const ALLOWED_SORTS = new Set(['date_desc', 'date_asc', 'amount_desc', 'amount_asc']);

function validateExpenseInput(req, res, next) {
  const { amount, category, description, date } = req.body;

  if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Amount is required and must be greater than 0' });
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: 'Category is required' });
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'Description is required' });
  }

  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'Date is required and must be a valid date' });
  }

  next();
}

router.post('/', validateExpenseInput, async (req, res) => {
  try {
    const {
      amount,
      category,
      description,
      date,
      idempotency_key: snakeCaseIdempotencyKey,
      idempotencyKey: camelCaseIdempotencyKey,
    } = req.body;
    const idempotencyKey = snakeCaseIdempotencyKey || camelCaseIdempotencyKey || null;

    if (idempotencyKey) {
      const [existing] = await pool.execute(
        'SELECT id, amount, category, description, date, idempotency_key FROM expenses WHERE idempotency_key = ?',
        [idempotencyKey]
      );

      if (existing.length > 0) {
        const expense = existing[0];
        return res.status(200).json({
          id: expense.id,
          amount: expense.amount / 100,
          category: expense.category,
          description: expense.description,
          date: new Date(expense.date).toISOString().split('T')[0],
          idempotency_key: expense.idempotency_key,
          idempotent: true
        });
      }
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const cleanCategory = category.trim();
    const cleanDescription = description.trim();

    const [result] = await pool.execute(
      'INSERT INTO expenses (amount, category, description, date, idempotency_key) VALUES (?, ?, ?, ?, ?)',
      [amountInPaise, cleanCategory, cleanDescription, date, idempotencyKey || null]
    );

    res.status(201).json({
      id: result.insertId,
      amount: amountInPaise / 100,
      category: cleanCategory,
      description: cleanDescription,
      date,
      idempotency_key: idempotencyKey,
      idempotent: false
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, sort = 'date_desc' } = req.query;
    let query = 'SELECT id, amount, category, description, date, created_at, idempotency_key FROM expenses';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (!ALLOWED_SORTS.has(sort)) {
      return res.status(400).json({ error: 'Invalid sort value' });
    }

    if (sort === 'date_desc') {
      query += ' ORDER BY date DESC';
    } else if (sort === 'date_asc') {
      query += ' ORDER BY date ASC';
    } else if (sort === 'amount_desc') {
      query += ' ORDER BY amount DESC';
    } else if (sort === 'amount_asc') {
      query += ' ORDER BY amount ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const [expenses] = await pool.execute(query, params);

    const formattedExpenses = expenses.map(expense => ({
      id: expense.id,
      amount: expense.amount / 100,
      category: expense.category,
      description: expense.description,
      date: new Date(expense.date).toISOString().split('T')[0],
      created_at: expense.created_at,
      idempotency_key: expense.idempotency_key
    }));

    res.status(200).json(formattedExpenses);
  } catch (error) {
  console.error("FULL ERROR:", error);
  res.status(500).json({
    error: error.message,
    code: error.code,
  });
}
});

export default router;