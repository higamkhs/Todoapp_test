import React, { useState } from 'react';
import { Calendar, Clock, Flag, Tag, Trash2, Edit3, Check, X } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { Todo } from '../types';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo, updateTodo, categories } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const category = categories.find(c => c.id === todo.category);

  const handleSaveEdit = () => {
    updateTodo(todo.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '?';
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return '今日';
    if (isTomorrow(date)) return '明日';
    return format(date, 'M月d日 (E)', { locale: ja });
  };

  const getDueDateColor = (date: Date) => {
    if (isPast(date) && !isToday(date)) return 'text-red-600 bg-red-50';
    if (isToday(date)) return 'text-orange-600 bg-orange-50';
    if (isTomorrow(date)) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all ${
        todo.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {todo.completed && <Check size={12} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="説明を入力..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Check size={14} />
                  保存
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <X size={14} />
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`font-semibold text-gray-800 ${
                todo.completed ? 'line-through' : ''
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`text-gray-600 mt-1 text-sm ${
                  todo.completed ? 'line-through' : ''
                }`}>
                  {todo.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* Due Date */}
                {todo.dueDate && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    getDueDateColor(todo.dueDate)
                  }`}>
                    <Calendar size={12} />
                    {formatDueDate(todo.dueDate)}
                  </span>
                )}

                {/* Priority */}
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${
                  getPriorityColor(todo.priority)
                }`}>
                  <Flag size={12} />
                  {getPriorityText(todo.priority)}
                </span>

                {/* Category */}
                {category && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </span>
                )}

                {/* Tags */}
                {todo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-400 mt-2">
                作成日: {format(todo.createdAt, 'yyyy年M月d日 HH:mm', { locale: ja })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TodoItem;