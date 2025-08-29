import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface TodoFormProps {
  onAdd: (text: string, priority: 'low' | 'medium' | 'high', category: string, notes?: string) => void;
  categories: string[];
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd, categories }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority, category || 'General', notes.trim() || undefined);
      setText('');
      setNotes('');
      setCategory('');
      setPriority('medium');
      setIsExpanded(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-gradient-to-r from-night-800/60 to-night-700/60 rounded-xl p-6 mb-6 border border-night-600/30 backdrop-blur-sm"
    >
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add new task..."
          className="flex-grow bg-night-700/50 text-slate-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sakura-400 placeholder-slate-400"
          onFocus={() => setIsExpanded(true)}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-gradient-to-r from-sakura-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-sakura-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full bg-night-700/50 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sakura-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-night-700/50 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sakura-400"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="New Category">+ New Category</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details or notes..."
              rows={2}
              className="w-full bg-night-700/50 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sakura-400 placeholder-slate-400 resize-none"
            />
          </div>
        </motion.div>
      )}
    </motion.form>
  );
};
