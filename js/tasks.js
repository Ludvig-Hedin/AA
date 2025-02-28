/**
 * Task management functionality for Personal Assistant
 */

// Task priority levels
const PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
};

// DOM Elements
let taskList;
let taskForm;
let filterSelect;
let sortSelect;
let searchInput;

// Initialize tasks functionality
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  taskList = document.getElementById('task-list');
  taskForm = document.getElementById('task-form');
  filterSelect = document.getElementById('task-filter');
  sortSelect = document.getElementById('task-sort');
  searchInput = document.getElementById('task-search');
  
  // Initialize event listeners
  initializeTaskForm();
  initializeTaskFilters();
  
  // Load tasks
  loadTasks();
});

/**
 * Initialize task form
 */
function initializeTaskForm() {
  if (!taskForm) return;
  
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(taskForm);
    const task = {
      title: formData.get('title'),
      description: formData.get('description') || '',
      priority: parseInt(formData.get('priority')) || PRIORITY.MEDIUM,
      due_date: formData.get('due_date') || null,
      tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
      is_completed: false,
      created_at: new Date().toISOString()
    };
    
    const taskId = taskForm.dataset.taskId;
    
    if (taskId) {
      // Update existing task
      await updateTask(taskId, task);
    } else {
      // Create new task
      await createTask(task);
    }
    
    // Reset form
    taskForm.reset();
    taskForm.removeAttribute('data-task-id');
    
    // Update submit button text
    const submitButton = taskForm.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.textContent = 'Skapa uppgift';
    }
    
    // Reload tasks
    loadTasks();
  });
}

/**
 * Initialize task filters and sorting
 */
function initializeTaskFilters() {
  // Filter tasks
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      loadTasks();
    });
  }
  
  // Sort tasks
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      loadTasks();
    });
  }
  
  // Search tasks
  if (searchInput) {
    searchInput.addEventListener('input', window.app.debounce(() => {
      loadTasks();
    }, 300));
  }
}

/**
 * Load tasks from Supabase
 */
async function loadTasks() {
  if (!taskList) return;
  
  // Show loading state
  taskList.innerHTML = '<div class="text-center py-4">Laddar uppgifter...</div>';
  
  try {
    // Get tasks from API
    const tasks = await getTasks();
    
    // Apply filters
    let filteredTasks = [...tasks];
    
    // Filter by status
    if (filterSelect) {
      const filter = filterSelect.value;
      if (filter === 'active') {
        filteredTasks = filteredTasks.filter(task => !task.is_completed);
      } else if (filter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.is_completed);
      }
    }
    
    // Filter by search query
    if (searchInput && searchInput.value) {
      const query = searchInput.value.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply sorting
    if (sortSelect) {
      const sort = sortSelect.value;
      
      filteredTasks.sort((a, b) => {
        // Always put completed tasks at the bottom
        if (a.is_completed !== b.is_completed) {
          return a.is_completed ? 1 : -1;
        }
        
        if (sort === 'priority') {
          return b.priority - a.priority;
        } else if (sort === 'dueDate') {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        } else if (sort === 'created') {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        
        return 0;
      });
    }
    
    // Render tasks
    renderTasks(filteredTasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
    taskList.innerHTML = `<div class="text-center py-4 text-error">Kunde inte ladda uppgifter: ${error.message}</div>`;
  }
}

/**
 * Render tasks to the DOM
 * @param {Array} tasks - Array of task objects
 */
function renderTasks(tasks) {
  if (!taskList) return;
  
  if (tasks.length === 0) {
    taskList.innerHTML = '<div class="text-center py-4 text-muted">Inga uppgifter hittades</div>';
    return;
  }
  
  // Clear task list
  taskList.innerHTML = '';
  
  // Create task items
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.is_completed ? 'task-completed' : ''}`;
    taskItem.dataset.taskId = task.id;
    
    // Priority class
    let priorityClass = '';
    if (task.priority === PRIORITY.HIGH) {
      priorityClass = 'task-priority-high';
    } else if (task.priority === PRIORITY.MEDIUM) {
      priorityClass = 'task-priority-medium';
    } else {
      priorityClass = 'task-priority-low';
    }
    
    // Format due date
    let dueDate = '';
    if (task.due_date) {
      dueDate = `<span class="task-due-date">${window.app.formatDate(task.due_date)}</span>`;
    }
    
    // Format tags
    let tags = '';
    if (task.tags && task.tags.length > 0) {
      tags = `<div class="task-tags">
        ${task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('')}
      </div>`;
    }
    
    // Task HTML
    taskItem.innerHTML = `
      <div class="task-checkbox">
        <input type="checkbox" id="task-${task.id}" ${task.is_completed ? 'checked' : ''}>
        <label for="task-${task.id}" class="sr-only">Mark as ${task.is_completed ? 'incomplete' : 'complete'}</label>
      </div>
      <div class="task-content">
        <div class="task-title">
          <span class="task-priority ${priorityClass}"></span>
          ${task.title}
        </div>
        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
        <div class="task-meta">
          ${dueDate}
          ${tags}
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-icon edit-task" aria-label="Edit task">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon delete-task" aria-label="Delete task">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    // Add event listeners
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      toggleTaskCompletion(task.id, checkbox.checked);
    });
    
    const editButton = taskItem.querySelector('.edit-task');
    editButton.addEventListener('click', () => {
      editTask(task);
    });
    
    const deleteButton = taskItem.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
      if (confirm('Är du säker på att du vill ta bort denna uppgift?')) {
        deleteTask(task.id);
      }
    });
    
    // Add to task list
    taskList.appendChild(taskItem);
  });
}

/**
 * Get tasks from Supabase
 * @returns {Promise<Array>} Array of task objects
 */
async function getTasks() {
  try {
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await client
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

/**
 * Create a new task
 * @param {Object} task - Task object
 * @returns {Promise<Object>} Created task
 */
async function createTask(task) {
  try {
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await client
      .from('tasks')
      .insert([{ ...task, user_id: user.id }])
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    window.app.showNotification('Uppgift skapad', 'success');
    return data[0];
  } catch (error) {
    console.error('Error creating task:', error);
    window.app.showNotification(`Kunde inte skapa uppgift: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Update an existing task
 * @param {string} taskId - Task ID
 * @param {Object} task - Updated task object
 * @returns {Promise<Object>} Updated task
 */
async function updateTask(taskId, task) {
  try {
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const { data, error } = await client
      .from('tasks')
      .update(task)
      .eq('id', taskId)
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    window.app.showNotification('Uppgift uppdaterad', 'success');
    return data[0];
  } catch (error) {
    console.error('Error updating task:', error);
    window.app.showNotification(`Kunde inte uppdatera uppgift: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteTask(taskId) {
  try {
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const { error } = await client
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Remove task from DOM
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskItem) {
      taskItem.remove();
    }
    
    window.app.showNotification('Uppgift borttagen', 'success');
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    window.app.showNotification(`Kunde inte ta bort uppgift: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Toggle task completion status
 * @param {string} taskId - Task ID
 * @param {boolean} isCompleted - New completion status
 * @returns {Promise<Object>} Updated task
 */
async function toggleTaskCompletion(taskId, isCompleted) {
  try {
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const { data, error } = await client
      .from('tasks')
      .update({ is_completed: isCompleted })
      .eq('id', taskId)
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Update task item in DOM
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskItem) {
      if (isCompleted) {
        taskItem.classList.add('task-completed');
      } else {
        taskItem.classList.remove('task-completed');
      }
    }
    
    return data[0];
  } catch (error) {
    console.error('Error toggling task completion:', error);
    window.app.showNotification(`Kunde inte uppdatera uppgift: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Populate form with task data for editing
 * @param {Object} task - Task object
 */
function editTask(task) {
  if (!taskForm) return;
  
  // Set form fields
  taskForm.elements.title.value = task.title;
  taskForm.elements.description.value = task.description || '';
  taskForm.elements.priority.value = task.priority;
  
  if (task.due_date) {
    // Format date for input (YYYY-MM-DD)
    const date = new Date(task.due_date);
    const formattedDate = date.toISOString().split('T')[0];
    taskForm.elements.due_date.value = formattedDate;
  } else {
    taskForm.elements.due_date.value = '';
  }
  
  if (task.tags && task.tags.length > 0) {
    taskForm.elements.tags.value = task.tags.join(', ');
  } else {
    taskForm.elements.tags.value = '';
  }
  
  // Set task ID for update
  taskForm.dataset.taskId = task.id;
  
  // Update submit button text
  const submitButton = taskForm.querySelector('[type="submit"]');
  if (submitButton) {
    submitButton.textContent = 'Uppdatera uppgift';
  }
  
  // Scroll to form
  taskForm.scrollIntoView({ behavior: 'smooth' });
}

// Export task functions
window.tasks = {
  loadTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
}; 