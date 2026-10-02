"use strict";

// ---- Element references ----
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const EMPTY_MESSAGE = "Task cannot be empty";
let taskCounter = 0;

// ---- Helpers ----
function generateTaskId() {
  taskCounter += 1;
  let id = "task-" + taskCounter;
  // Guarantee uniqueness even if an id already exists in the DOM
  while (taskList.querySelector('[data-task-id="' + id + '"]')) {
    taskCounter += 1;
    id = "task-" + taskCounter;
  }
  return id;
}

// ---- Required functions ----
function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";

  li.append(span, completeBtn, editBtn, removeBtn);
  return li;
}

function addTask(taskText) {
  const text = taskText.trim();
  if (text === "") {
    taskMessage.textContent = EMPTY_MESSAGE;
    return;
  }

  const taskId = generateTaskId();
  const taskItem = createTaskElement(text, taskId);
  taskList.appendChild(taskItem);

  taskInput.value = "";
  taskMessage.textContent = "";
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const span = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!span || !editBtn) return;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = span.textContent;

  span.replaceWith(input);
  editBtn.textContent = "Save";
  input.focus();
}

function saveTaskEdit(taskItem) {
  const input = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!input || !editBtn) return;

  const newText = input.value.trim();
  if (newText === "") {
    taskMessage.textContent = EMPTY_MESSAGE;
    return;
  }

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = newText;

  input.replaceWith(span);
  editBtn.textContent = "Edit";
  taskMessage.textContent = "";
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const total = taskList.querySelectorAll(".task-item").length;
  const pending = taskList.querySelectorAll('.task-item[data-state="pending"]').length;
  const completed = taskList.querySelectorAll('.task-item[data-state="completed"]').length;

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem || !taskList.contains(taskItem)) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const samples = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();
  samples.forEach(function (text) {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });

  taskList.appendChild(fragment);
  taskMessage.textContent = "";
  updateTaskCounts();
}

// ---- Event wiring ----
addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

// The single delegated click listener for all task actions
taskList.addEventListener("click", handleTaskListClick);

// Initial state
updateTaskCounts();
