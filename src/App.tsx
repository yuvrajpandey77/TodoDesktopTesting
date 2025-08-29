import { useState, useMemo } from 'react';
import { TodoItem } from './components/TodoItem';
import { TodoForm } from './components/TodoForm';
import { TodoFilter } from './components/TodoFilter';
import { TodoStats } from './components/TodoStats';
import { Particles } from './components/Particles';
import { TitleBar } from './components/TitleBar';
import { useTodoStorage } from './hooks/useTodoStorage';
import { TodoStats as TodoStatsType } from './types/todo';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo } = useTodoStorage();
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Get unique categories from todos
  const categories = useMemo(() => {
    const cats = Array.from(new Set(todos.map(todo => todo.category)));
    return ['Work', 'Personal', 'Health', 'Learning', 'Leisure', 'Food', 'Shopping', ...cats].filter((cat, index, arr) => arr.indexOf(cat) === index);
  }, [todos]);

  // Filter todos based on current filters
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const statusFilter = filter === 'all' || 
                          (filter === 'active' && !todo.completed) || 
                          (filter === 'completed' && todo.completed);
      const catFilter = !categoryFilter || todo.category === categoryFilter;
      return statusFilter && catFilter;
    });
  }, [todos, filter, categoryFilter]);

  // Calculate stats
  const stats: TodoStatsType = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const highPriority = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;
    
    return { total, completed, pending, highPriority };
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-sakura-900 to-night-800 relative overflow-hidden">
      <TitleBar />
      <Particles />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-sakura-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
            Sakura Todo
          </h1>
          <p className="text-slate-400 text-lg">
            Beautiful task management to brighten your days
          </p>
        </header>

        <TodoStats stats={stats} />
        
        <TodoForm onAdd={addTodo} categories={categories} />
        
        <TodoFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          categories={categories}
          currentCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌸</div>
              <p className="text-slate-400 text-lg">
                {filter === 'completed' ? 'No completed tasks' : 
                 filter === 'active' ? 'No active tasks' : 
                 'No tasks yet'}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Add a new task to get started
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Beautiful productivity like cherry blossoms 🌸</p>
        </footer>
      </div>
    </div>
  );
}

export default App;