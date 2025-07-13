// Todo App JavaScript
class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.initElements();
        this.bindEvents();
        this.render();
    }
    
    initElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.todoCount = document.getElementById('todoCount');
        this.emptyState = document.getElementById('emptyState');
        this.clearBtn = document.getElementById('clearCompleted');
    }
    
    bindEvents() {
        // Add todo events
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        
        // Filter events
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        // Clear completed
        this.clearBtn.addEventListener('click', () => this.clearCompleted());
        
        // Auto-save on window unload
        window.addEventListener('beforeunload', () => this.saveTodos());
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        if (this.editingId) {
            this.updateTodo(this.editingId, text);
            this.editingId = null;
        } else {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            this.todos.unshift(todo);
        }
        
        this.todoInput.value = '';
        this.updateAddButtonState();
        this.saveTodos();
        this.render();
    }
    
    updateTodo(id, text) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            todo.updatedAt = new Date().toISOString();
        }
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.todoInput.value = todo.text;
            this.todoInput.focus();
            this.editingId = id;
            this.updateAddButtonState();
        }
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        this.render();
    }
    
    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        this.renderTodos(filteredTodos);
        this.updateTodoCount();
        this.updateEmptyState(filteredTodos.length === 0);
        this.updateClearButton();
    }
    
    renderTodos(todos) {
        this.todoList.innerHTML = '';
        
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                     data-id="${todo.id}"></div>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="edit-btn" data-id="${todo.id}" title="編集">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${todo.id}" title="削除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners
            const checkbox = li.querySelector('.todo-checkbox');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');
            
            checkbox.addEventListener('click', () => this.toggleTodo(todo.id));
            editBtn.addEventListener('click', () => this.editTodo(todo.id));
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            this.todoList.appendChild(li);
        });
    }
    
    updateTodoCount() {
        const activeTodos = this.todos.filter(t => !t.completed).length;
        this.todoCount.textContent = activeTodos;
    }
    
    updateEmptyState(show) {
        if (show) {
            this.emptyState.classList.remove('hidden');
        } else {
            this.emptyState.classList.add('hidden');
        }
    }
    
    updateClearButton() {
        const hasCompleted = this.todos.some(t => t.completed);
        this.clearBtn.disabled = !hasCompleted;
    }
    
    updateAddButtonState() {
        const isEditing = this.editingId !== null;
        this.addBtn.innerHTML = isEditing ? '<i class="fas fa-save"></i>' : '<i class="fas fa-plus"></i>';
        this.addBtn.title = isEditing ? 'タスクを保存' : 'タスクを追加';
        this.todoInput.placeholder = isEditing ? 'タスクを編集...' : '新しいタスクを入力...';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    loadTodos() {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    
    // Add some sample todos if none exist
    if (app.todos.length === 0) {
        const sampleTodos = [
            { id: 1, text: 'Todoアプリを完成させる', completed: false, createdAt: new Date().toISOString() },
            { id: 2, text: 'ドキュメントを読む', completed: true, createdAt: new Date().toISOString() },
            { id: 3, text: 'コーヒーを飲む', completed: false, createdAt: new Date().toISOString() }
        ];
        
        app.todos = sampleTodos;
        app.saveTodos();
        app.render();
    }
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add todo
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('addBtn').click();
    }
    
    // Escape to cancel editing
    if (e.key === 'Escape') {
        const todoInput = document.getElementById('todoInput');
        if (todoInput.value) {
            todoInput.value = '';
            // Reset add button state if editing
            document.getElementById('addBtn').innerHTML = '<i class="fas fa-plus"></i>';
            document.getElementById('addBtn').title = 'タスクを追加';
            todoInput.placeholder = '新しいタスクを入力...';
        }
    }
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(e.target);
});

function handleSwipe(element) {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    // Find the closest todo item
    const todoItem = element.closest('.todo-item');
    if (!todoItem) return;
    
    // Swipe left to delete
    if (swipeDistance < -swipeThreshold) {
        const deleteBtn = todoItem.querySelector('.delete-btn');
        if (deleteBtn) deleteBtn.click();
    }
    
    // Swipe right to toggle
    if (swipeDistance > swipeThreshold) {
        const checkbox = todoItem.querySelector('.todo-checkbox');
        if (checkbox) checkbox.click();
    }
}

// Add visual feedback for actions
document.addEventListener('click', (e) => {
    if (e.target.matches('.todo-checkbox, .add-btn, .filter-btn, .clear-btn, .edit-btn, .delete-btn')) {
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

// Auto-focus input on page load
window.addEventListener('load', () => {
    document.getElementById('todoInput').focus();
});