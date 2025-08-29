import React, { useState } from 'react';
import { Check, Clock, AlertCircle, Trash2, Edit3, Save } from 'lucide-react';
import { Todo } from '../types/todo';
import { motion, AnimatePresence } from 'framer-motion';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const priorityColors = {
    low: 'text-sky-400 bg-sky-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    high: 'text-red-400 bg-red-400/10',
  };

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
        whileHover={{ scale: 1.02 }}
        className={`relative overflow-hidden rounded-xl p-4 mb-3 transition-all duration-300 ${
          todo.completed
            ? 'bg-night-800/50 border border-night-700/50'
            : 'bg-gradient-to-r from-sakura-900/50 to-night-800/50 border border-sakura-700/30 shadow-lg'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 flex items-start gap-3">
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
              todo.completed
                ? 'bg-sakura-400 border-sakura-400'
                : 'border-sakura-400 hover:border-sakura-300 hover:scale-110'
            }`}
          >
            {todo.completed && (
              <Check className="w-4 h-4 text-white mx-auto my-0.5" />
            )}
          </button>

          <div className="flex-grow">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-grow bg-night-700/50 text-slate-100 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-sakura-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                />
                <button
                  onClick={handleEdit}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <p
                  className={`text-slate-100 transition-all duration-300 ${
                    todo.completed ? 'line-through opacity-50' : ''
                  }`}
                >
                  {todo.text}
                </p>
                {todo.notes && (
                  <p className="text-sm text-slate-400 mt-1">{todo.notes}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
                    {todo.priority}
                  </span>
                  <span className="text-xs text-slate-500">
                    {todo.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 ml-auto">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-sakura-400 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(todo.id)}
              className="text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};