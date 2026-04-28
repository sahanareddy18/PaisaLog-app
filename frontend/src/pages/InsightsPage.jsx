import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const CHART_COLORS = ['#1f66b3', '#4a92dd', '#76ade7', '#2b77c9', '#5ea0e0', '#9fc6ef'];

function InsightsPage({ expenses, total, categoryTotals }) {
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));

  const dailySpendMap = expenses.reduce((acc, item) => {
    const key = item.date;
    acc[key] = (acc[key] || 0) + Number(item.amount);
    return acc;
  }, {});

  const dailySpend = Object.entries(dailySpendMap)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      amount: Number(amount.toFixed(2)),
    }));

  return (
    <>
      <div className="page-head">
        <h2>Insights</h2>
        <p>Understand where your money is going with a quick category breakdown.</p>
      </div>
      <div className="insights-card">
        <h3>Spend by Category</h3>
        {!expenses.length && <p>Add expenses to see category insights.</p>}
        {!!expenses.length && (
          <div className="charts-grid">
            <div className="chart-panel">
              <h4>Category Distribution</h4>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={sortedCategories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry) => `${entry.name}`}
                    >
                      {sortedCategories.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`Rs ${Number(value).toFixed(2)}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-panel">
              <h4>Daily Spend Trend</h4>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dailySpend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dbe7f7" />
                    <XAxis dataKey="date" tick={{ fill: '#375a94', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#375a94', fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`Rs ${Number(value).toFixed(2)}`, 'Spent']} />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#1f66b3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {sortedCategories.map((item) => {
          const percent = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div className="insight-row" key={item.name}>
              <div className="insight-label">
                <span>{item.name}</span>
                <small>
                  Rs {item.value.toFixed(2)} ({percent.toFixed(1)}%)
                </small>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default InsightsPage;
