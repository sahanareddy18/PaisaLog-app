import React from 'react';
import FilterBar from '../FilterBar';
import ExpenseList from '../ExpenseList';

function DashboardPage({
  filter,
  setFilter,
  sort,
  setSort,
  loading,
  expenses,
  total,
  highestExpense,
  categoryTotals,
}) {
  return (
    <>
      <div className="page-head">
        <h2>Dashboard</h2>
        <p>Track spending with filters, sorting, and quick summaries.</p>
      </div>
      <FilterBar filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Spend</p>
          <h3>Rs {total.toFixed(2)}</h3>
        </div>
        <div className="stat-card">
          <p>Visible Entries</p>
          <h3>{expenses.length}</h3>
        </div>
        <div className="stat-card">
          <p>Highest Expense</p>
          <h3>Rs {highestExpense.toFixed(2)}</h3>
        </div>
      </div>
      <ExpenseList expenses={expenses} loading={loading} total={total} />
      {!loading && expenses.length > 0 && (
        <div className="category-summary">
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <span key={category}>
              {category}: Rs {amount.toFixed(2)}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export default DashboardPage;
