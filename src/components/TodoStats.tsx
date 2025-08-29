import React from 'react';
import { BarChart3, CheckCircle2, Clock, Star } from 'lucide-react';
import  { TodoStats as TodoStatsType     } from '../types/todo';
import { motion } from 'framer-motion';

interface TodoStatsProps {
  stats: TodoStatsType;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        {
          icon: BarChart3,
          label: 'Total',
          value: stats.total,
          color: 'text-blue-400',
        },
        {
          icon: CheckCircle2,
          label: 'Completed',
          value: stats.completed,
          color: 'text-green-400',
        },
        {
          icon: Clock,
          label: 'Pending',
          value: stats.pending,
          color: 'text-yellow-400',
        },
        {
          icon: Star,
          label: 'High Priority',
          value: stats.highPriority,
          color: 'text-red-400',
        },
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-night-800/50 to-night-700/50 rounded-xl p-4 border border-night-600/30"
        >
          <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-sm text-slate-400">{stat.label}</p>
        </motion.div>
      ))}
      
      <div className="col-span-full mt-2">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Completion Rate</span>
          <span>{completionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-night-700 rounded-full h-2 mt-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            className="bg-gradient-to-r from-sakura-400 to-purple-400 h-2 rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};