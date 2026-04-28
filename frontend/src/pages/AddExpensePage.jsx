import React from 'react';
import ExpenseForm from '../ExpenseForm';

function AddExpensePage({ formRef, onAddExpense, formLoading, recentExpenses }) {
  return (
    <>
      <div className="page-head">
        <h2>Add Expense</h2>
        <p>Create entries quickly with safe idempotent submission.</p>
      </div>
      <ExpenseForm ref={formRef} onAddExpense={onAddExpense} loading={formLoading} />
      <div className="recent-card">
        <h3>Recent Expenses</h3>
        {!recentExpenses.length && <p>No recent entries yet.</p>}
        {recentExpenses.map((item) => (
          <div className="recent-row" key={item.id}>
            <span>{item.description}</span>
            <span>{item.category}</span>
            <strong>Rs {Number(item.amount).toFixed(2)}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

export default AddExpensePage;
