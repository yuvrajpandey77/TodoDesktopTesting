import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';

interface UseTodoStorage {
  todos: Todo[];
  addTodo: (text: string, priority: 'low' | 'medium' | 'high', category: string, notes?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
}

export const useTodoStorage = (): UseTodoStorage => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem('sakura-todos');
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        text: 'Go see cherry blossoms 🌸',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        category: 'Leisure',
        notes: 'Would like to see the night cherry blossom light-up too',
      },
      {
        id: '2',
        text: 'Try new Japanese sweets',
        completed: true,
        priority: 'low',
        createdAt: new Date(Date.now() - 86400000),
        category: 'Food',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('sakura-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: 'low' | 'medium' | 'high', category: string, notes?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      category,
      notes,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo };
};