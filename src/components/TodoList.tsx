import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';
import { motion } from 'framer-motion';

const TodoList: React.FC = () => {
  const { getFilteredTodos } = useTodoStore();
  const todos = getFilteredTodos();

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 text-center"
      >
        <div className="text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">タスクがありません</h3>
          <p className="text-gray-400">上のフォームから新しいタスクを追加してください</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        タスク一覧 ({todos.length}件)
      </h2>
      
      <Droppable droppableId="todo-list">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-3 min-h-[200px] ${
              snapshot.isDraggingOver ? 'bg-blue-50/50 rounded-lg' : ''
            }`}
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                      snapshot.isDragging ? 'rotate-2 scale-105' : ''
                    } transition-transform`}
                  >
                    <TodoItem todo={todo} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </motion.div>
  );
};

export default TodoList;