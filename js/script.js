const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;

    emptyState.style.display = total === 0 ? 'block' : 'none';
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('role', 'listitem');
        li.innerHTML = `
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${idx})" aria-label="Mark task as complete" />
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <button class="remove-btn" onclick="removeTask(${idx})" title="Delete task" aria-label="Delete task">
                        ❌
                    </button>
                `;
        taskList.appendChild(li);
    });
    updateStats();
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.focus();
        return;
    }

    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
    taskInput.focus();
}

function toggleTask(idx) {
    if (tasks[idx]) {
        tasks[idx].completed = !tasks[idx].completed;
        saveTasks();
        renderTasks();
    }
}

function removeTask(idx) {
    const li = document.querySelectorAll('.task-item')[idx];
    if (li) {
        li.classList.add('removing');
        setTimeout(() => {
            tasks.splice(idx, 1);
            saveTasks();
            renderTasks();
        }, 300);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// keyboard support: Enter to add task
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

// initial render
renderTasks();