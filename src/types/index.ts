export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface FilterState {
  search: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  status: 'all' | 'active' | 'completed';
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface TodoFormData {
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags: string[];
}