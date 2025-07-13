import React, { useState } from 'react';
import { Folder, Plus, Edit2, Trash2, Filter, Calendar, Flag, Check } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, filters, setFilters, todos } = useTodoStore();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({ name: newCategoryName, color: newCategoryColor });
      setNewCategoryName('');
      setNewCategoryColor('#3b82f6');
      setIsAddingCategory(false);
    }
  };

  const getCategoryTodoCount = (categoryId: string) => {
    return todos.filter(todo => todo.category === categoryId).length;
  };

  const getFilterCount = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'all':
        return todos.length;
      case 'active':
        return todos.filter(todo => !todo.completed).length;
      case 'completed':
        return todos.filter(todo => todo.completed).length;
      case 'overdue':
        return todos.filter(todo => todo.dueDate && todo.dueDate < new Date() && !todo.completed).length;
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return todos.filter(todo => 
          todo.dueDate && 
          todo.dueDate >= today && 
          todo.dueDate < tomorrow
        ).length;
      case 'priority':
        return todos.filter(todo => todo.priority === value).length;
      default:
        return 0;
    }
  };

  const predefinedColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Quick Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Filter size={18} />
          クイックフィルター
        </h3>
        
        <div className="space-y-2">
          <button
            onClick={() => setFilters({ status: 'all', category: undefined, priority: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              filters.status === 'all' && !filters.category && !filters.priority
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>すべて</span>
            <span className="text-sm text-gray-500">{getFilterCount('all')}</span>
          </button>
          
          <button
            onClick={() => setFilters({ status: 'active', category: undefined, priority: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              filters.status === 'active' && !filters.category && !filters.priority
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>アクティブ</span>
            <span className="text-sm text-gray-500">{getFilterCount('active')}</span>
          </button>
          
          <button
            onClick={() => setFilters({ status: 'completed', category: undefined, priority: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              filters.status === 'completed' && !filters.category && !filters.priority
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>完了済み</span>
            <span className="text-sm text-gray-500">{getFilterCount('completed')}</span>
          </button>
          
          <button
            onClick={() => setFilters({ status: 'active', category: undefined, priority: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50`}
          >
            <span>期限切れ</span>
            <span className="text-sm text-red-400">{getFilterCount('overdue')}</span>
          </button>
          
          <button
            onClick={() => setFilters({ status: 'active', category: undefined, priority: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-orange-600 hover:bg-orange-50`}
          >
            <span>今日</span>
            <span className="text-sm text-orange-400">{getFilterCount('today')}</span>
          </button>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Flag size={18} />
          優先度
        </h3>
        
        <div className="space-y-2">
          <button
            onClick={() => setFilters({ priority: 'high', category: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              filters.priority === 'high'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              高
            </span>
            <span className="text-sm text-gray-500">{getFilterCount('priority', 'high')}</span>
          </button>
          
          <button
            onClick={() => setFilters({ priority: 'medium', category: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              filters.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              中
            </span>
            <span className="text-sm text-gray-500">{getFilterCount('priority', 'medium')}</span>
          </button>
          
          <button
            onClick={() => setFilters({ priority: 'low', category: undefined })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              filters.priority === 'low'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              低
            </span>
            <span className="text-sm text-gray-500">{getFilterCount('priority', 'low')}</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Folder size={18} />
            カテゴリ
          </h3>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilters({ category: category.id, priority: undefined })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                filters.category === category.id
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                {category.name}
              </span>
              <span className="text-sm text-gray-500">{getCategoryTodoCount(category.id)}</span>
            </button>
          ))}
          
          {isAddingCategory && (
            <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="カテゴリ名"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-1 mb-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      newCategoryColor === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddCategory}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Check size={14} />
                  追加
                </button>
                <button
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategoryName('');
                    setNewCategoryColor('#3b82f6');
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;