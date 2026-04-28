import React from 'react';

function ExpenseList({ expenses, loading, total }) {
  if (loading) {
    return (
      <div className="expense-list">
        <div className="skeleton-row" />
        <div className="skeleton-row" />
        <div className="skeleton-row" />
      </div>
    );
  }

  if (!expenses.length) return <div className="empty-state">No expenses found.</div>;

  return (
    <div className="expense-list">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th style={{ textAlign: 'right' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>
                <span className="date-pill">{e.date}</span>
              </td>
              <td>
                <span className="category-pill">{e.category}</span>
              </td>
              <td>{e.description}</td>
              <td style={{ textAlign: 'right' }}>{Number(e.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: 10, fontWeight: 600 }}>
        Total: ₹{total.toFixed(2)}
      </div>
    </div>
  );
}

export default ExpenseList;
