import React from 'react';
import { Search, Filter, Calendar, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { filters, setFilters, todos, getOverdueTodos, getTodosCompletedToday } = useTodoStore();
  
  const activeTodos = todos.filter(todo => !todo.completed);
  const overdueTodos = getOverdueTodos();
  const completedToday = getTodosCompletedToday();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Title and Stats */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            リッチなTodoアプリ
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-blue-600">
              <CheckCircle2 size={16} />
              <span>{activeTodos.length} 件のアクティブタスク</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp size={16} />
              <span>{completedToday.length} 件完了 (今日)</span>
            </div>
            {overdueTodos.length > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <Clock size={16} />
                <span>{overdueTodos.length} 件の期限切れ</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="タスクを検索..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as 'all' | 'active' | 'completed' })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
          >
            <option value="all">すべて</option>
            <option value="active">アクティブ</option>
            <option value="completed">完了済み</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ priority: e.target.value as 'low' | 'medium' | 'high' | undefined })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
          >
            <option value="">優先度</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as 'dueDate' | 'priority' | 'createdAt' })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
          >
            <option value="dueDate">期限順</option>
            <option value="priority">優先度順</option>
            <option value="createdAt">作成日順</option>
          </select>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;