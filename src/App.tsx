import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useTodoStore } from './store/todoStore';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { motion } from 'framer-motion';

function App() {
  const { reorderTodos } = useTodoStore();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    reorderTodos(result.source.index, result.destination.index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Sidebar />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              <TodoForm />
              <DragDropContext onDragEnd={handleDragEnd}>
                <TodoList />
              </DragDropContext>
            </div>
          </motion.div>

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Dashboard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;