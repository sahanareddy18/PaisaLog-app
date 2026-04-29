import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AddExpensePage from './pages/AddExpensePage';
import InsightsPage from './pages/InsightsPage';

const API_URL = import.meta.env.VITE_API_URL || 'https://paisa-log-app-gnb4.vercel.app';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date_desc');
  const [formLoading, setFormLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const formRef = useRef();

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (filter) params.append('category', filter);
      params.append('sort', sort);

      const res = await fetch(`${API_URL}/expenses?${params}`);
      if (!res.ok) throw new Error('Failed to fetch expenses');

      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (expense) => {
    setFormLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add expense');
      }

      await fetchExpenses();
      if (formRef.current && formRef.current.resetForm) {
        formRef.current.resetForm();
      }
    } catch (err) {
      setError(err.message || 'Failed to add expense');
      setShowToast(true);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [expenses]
  );

  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, item) => {
      const key = item.category || 'Other';
      acc[key] = (acc[key] || 0) + Number(item.amount);
      return acc;
    }, {});
  }, [expenses]);

  const highestExpense = useMemo(
    () => (expenses.length ? Math.max(...expenses.map((item) => Number(item.amount))) : 0),
    [expenses]
  );

  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-logo">
            <span>Rs</span>
            <small>PAISA</small>
          </div>
          <div>
            <h1>Paisa<span>Log</span></h1>
            <p className="subtitle">Track every paisa, every day</p>
          </div>
        </div>
        <nav>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Add Entry
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Insights
          </NavLink>
        </nav>
      </aside>
      <main className="content">
        {showToast && error && <div className="error toast">{error}</div>}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                filter={filter}
                setFilter={setFilter}
                sort={sort}
                setSort={setSort}
                loading={loading}
                expenses={expenses}
                total={total}
                highestExpense={highestExpense}
                categoryTotals={categoryTotals}
              />
            }
          />
          <Route
            path="/add"
            element={
              <AddExpensePage
                formRef={formRef}
                onAddExpense={handleAddExpense}
                formLoading={formLoading}
                recentExpenses={recentExpenses}
              />
            }
          />
          <Route
            path="/insights"
            element={<InsightsPage expenses={expenses} total={total} categoryTotals={categoryTotals} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;