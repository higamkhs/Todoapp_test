import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, Calendar, Tag, AlignLeft, Flag } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { TodoFormData } from '../types';
import { motion } from 'framer-motion';

const TodoForm: React.FC = () => {
  const { addTodo, categories } = useTodoStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const { control, handleSubmit, reset, watch, setValue } = useForm<TodoFormData>({
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: '',
      tags: []
    }
  });

  const watchedTags = watch('tags') || [];

  const onSubmit = (data: TodoFormData) => {
    addTodo({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      priority: data.priority,
      category: data.category,
      tags: data.tags,
      completed: false
    });
    
    reset();
    setIsExpanded(false);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...watchedTags, tagInput.trim()];
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = watchedTags.filter(tag => tag !== tagToRemove);
    setValue('tags', newTags);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Input */}
        <div className="relative">
          <Controller
            name="title"
            control={control}
            rules={{ required: 'タイトルは必須です' }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="新しいタスクを追加..."
                  className="w-full px-4 py-3 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  onFocus={() => setIsExpanded(true)}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Expanded Form */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Description */}
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="詳細説明..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                    rows={3}
                  />
                )}
              />
            </div>

            {/* Due Date and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Due Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="datetime-local"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                  )}
                />
              </div>

              {/* Priority */}
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    >
                      <option value="low">低優先度</option>
                      <option value="medium">中優先度</option>
                      <option value="high">高優先度</option>
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">カテゴリを選択</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Tags */}
            <div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="タグを追加 (Enterで追加)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {watchedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  reset();
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                追加
              </button>
            </div>
          </motion.div>
        )}

        {/* Simple Submit Button (when not expanded) */}
        {!isExpanded && (
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            タスクを追加
          </button>
        )}
      </form>
    </motion.div>
  );
};

export default TodoForm;