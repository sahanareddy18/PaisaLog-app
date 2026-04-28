import React from 'react';

const categories = [
  '', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'
];

const sortOptions = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'amount_desc', label: 'Highest Amount' },
  { value: 'amount_asc', label: 'Lowest Amount' },
];

function FilterBar({ filter, setFilter, sort, setSort }) {
  return (
    <div className="filters-wrap">
      <div className="filter-chip-row">
        {categories.map((category) => {
          const isActive = filter === category;
          return (
            <button
              type="button"
              key={category || 'all'}
              className={`chip ${isActive ? 'chip-active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category || 'All'}
            </button>
          );
        })}
      </div>
      <div className="filters">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setFilter('')}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
