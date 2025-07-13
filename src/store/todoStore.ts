import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, Category, FilterState } from '../types';

interface TodoStore {
  todos: Todo[];
  categories: Category[];
  filters: FilterState;
  
  // Todo actions
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Filter actions
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // Utility functions
  getFilteredTodos: () => Todo[];
  getTodosByCategory: (categoryId: string) => Todo[];
  getOverdueTodos: () => Todo[];
  getTodosCompletedToday: () => Todo[];
}

const defaultFilters: FilterState = {
  search: '',
  category: undefined,
  priority: undefined,
  status: 'all',
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Personal', color: '#3b82f6' },
  { id: '2', name: 'Work', color: '#10b981' },
  { id: '3', name: 'Shopping', color: '#f59e0b' },
  { id: '4', name: 'Health', color: '#ef4444' },
];

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      categories: defaultCategories,
      filters: defaultFilters,
      
      addTodo: (todoData) => {
        const newTodo: Todo = {
          ...todoData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },
      
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, ...updates, updatedAt: new Date() }
              : todo
          ),
        }));
      },
      
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          ),
        }));
      },
      
      reorderTodos: (startIndex, endIndex) => {
        set((state) => {
          const filteredTodos = get().getFilteredTodos();
          const result = Array.from(filteredTodos);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          
          return {
            todos: result,
          };
        });
      },
      
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: crypto.randomUUID(),
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },
      
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },
      
      resetFilters: () => {
        set({ filters: defaultFilters });
      },
      
      getFilteredTodos: () => {
        const { todos, filters } = get();
        let filtered = [...todos];
        
        // Filter by search
        if (filters.search) {
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
              todo.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
              todo.tags.some((tag) =>
                tag.toLowerCase().includes(filters.search.toLowerCase())
              )
          );
        }
        
        // Filter by category
        if (filters.category) {
          filtered = filtered.filter((todo) => todo.category === filters.category);
        }
        
        // Filter by priority
        if (filters.priority) {
          filtered = filtered.filter((todo) => todo.priority === filters.priority);
        }
        
        // Filter by status
        switch (filters.status) {
          case 'active':
            filtered = filtered.filter((todo) => !todo.completed);
            break;
          case 'completed':
            filtered = filtered.filter((todo) => todo.completed);
            break;
          default:
            break;
        }
        
        // Sort
        filtered.sort((a, b) => {
          let aValue, bValue;
          
          switch (filters.sortBy) {
            case 'dueDate':
              aValue = a.dueDate ? a.dueDate.getTime() : Infinity;
              bValue = b.dueDate ? b.dueDate.getTime() : Infinity;
              break;
            case 'priority':
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              aValue = priorityOrder[a.priority];
              bValue = priorityOrder[b.priority];
              break;
            case 'createdAt':
              aValue = a.createdAt.getTime();
              bValue = b.createdAt.getTime();
              break;
            default:
              aValue = a.createdAt.getTime();
              bValue = b.createdAt.getTime();
          }
          
          if (filters.sortOrder === 'desc') {
            return bValue - aValue;
          }
          return aValue - bValue;
        });
        
        return filtered;
      },
      
      getTodosByCategory: (categoryId) => {
        const { todos } = get();
        return todos.filter((todo) => todo.category === categoryId);
      },
      
      getOverdueTodos: () => {
        const { todos } = get();
        const now = new Date();
        return todos.filter(
          (todo) => todo.dueDate && todo.dueDate < now && !todo.completed
        );
      },
      
      getTodosCompletedToday: () => {
        const { todos } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return todos.filter(
          (todo) =>
            todo.completed &&
            todo.updatedAt >= today &&
            todo.updatedAt < tomorrow
        );
      },
    }),
    {
      name: 'todo-storage',
      version: 1,
    }
  )
);