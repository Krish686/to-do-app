let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
const dueDateInput = document.getElementById("due-date");
const addTaskBtn = document.getElementById("add-task");
const filters = document.querySelectorAll(".filters button");
const clearCompletedBtn = document.getElementById("clear-completed");
const themeToggle = document.getElementById("theme-toggle");

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render all tasks
function renderTasks() {
  taskList.innerHTML = "";
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    const createdAt = new Date(task.createdAt).toLocaleString();
    const due = task.dueDate ? `Due: ${task.dueDate}` : "";

    li.innerHTML = `
      <div class="task-top">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}" />
          <span class="desc" contenteditable="true" data-id="${task.id}">${task.description}</span>
        </div>
        <button data-id="${task.id}">&times;</button>
      </div>
      <div class="meta">Created: ${createdAt}${due ? " • " + due : ""}</div>
    `;

    taskList.appendChild(li);
  });
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const text = newTaskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    description: text,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: dueDateInput.value || null
  };

  tasks.push(newTask);
  newTaskInput.value = "";
  dueDateInput.value = "";
  saveTasks();
  renderTasks();
});

// Handle complete/delete/edit
taskList.addEventListener("click", (e) => {
  const id = +e.target.dataset.id;
  if (e.target.tagName === "BUTTON") {
    tasks = tasks.filter(task => task.id !== id);
  } else if (e.target.type === "checkbox") {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
  }
  saveTasks();
  renderTasks();
});

// Handle edits
taskList.addEventListener("blur", (e) => {
  if (e.target.classList.contains("desc")) {
    const id = +e.target.dataset.id;
    const newDesc = e.target.textContent.trim();
    tasks = tasks.map(task =>
      task.id === id ? { ...task, description: newDesc } : task
    );
    saveTasks();
  }
}, true);

// Filter buttons
filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Theme toggle
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeButton(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeButton(next);
});

function updateThemeButton(theme) {
  themeToggle.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}

renderTasks();
