import React, { useState, forwardRef, useImperativeHandle } from 'react';

const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other',
];

const ExpenseForm = forwardRef(function ExpenseForm({ onAddExpense, loading }, ref) {
  const [form, setForm] = useState({
    amount: '',
    category: categories[0],
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  useImperativeHandle(ref, () => ({
    resetForm: () => setForm({
      amount: '',
      category: categories[0],
      description: '',
      date: new Date().toISOString().split('T')[0],
    }),
  }));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!form.amount || Number(form.amount) < 0.01) {
      nextErrors.amount = 'Amount must be at least 0.01';
    }
    if (!form.description.trim()) {
      nextErrors.description = 'Description is required';
    }
    if (!form.date) {
      nextErrors.date = 'Date is required';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await onAddExpense({
        ...form,
        amount: Number(form.amount),
        description: form.description.trim(),
        idempotency_key: crypto.randomUUID(),
      });
      setErrors({});
      setForm({
        amount: '',
        category: categories[0],
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to add expense' });
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {errors.submit && <div className="error">{errors.submit}</div>}
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
        />
        {errors.amount && <p className="field-error">{errors.amount}</p>}
      </div>
      <div className="form-group">
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        {errors.date && <p className="field-error">{errors.date}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
});

export default ExpenseForm;
