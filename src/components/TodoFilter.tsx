import React from 'react';
import { Filter, Star } from 'lucide-react';

interface TodoFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange,
  categories,
  currentCategory,
  onCategoryChange,
}) => {
  const filters = ['all', 'active', 'completed'];
  const filterLabels = {
    all: 'All',
    active: 'Active',
    completed: 'Completed',
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              currentFilter === filter
                ? 'bg-sakura-500 text-white shadow-lg animate-glow'
                : 'bg-night-700/50 text-slate-300 hover:bg-night-600/50'
            }`}
          >
            {filterLabels[filter as keyof typeof filterLabels]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          value={currentCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-night-700/50 text-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sakura-400"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};