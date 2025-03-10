const taskManager = new TaskManager();
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskText");
const addTaskBtn = document.getElementById("addTask");

function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    taskManager.getFilteredTasks(filter).forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task");
        if (task.status === "done") li.classList.add("done");

        li.innerHTML = `
            ${task.text}
            <button onclick="toggleTask(${task.id})">✓</button>
            <button onclick="removeTask(${task.id})">❌</button>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    taskManager.addTask(text);
    taskInput.value = "";
    renderTasks();
}

function removeTask(id) {
    taskManager.removeTask(id);
    renderTasks();
}

function toggleTask(id) {
    taskManager.toggleTaskStatus(id);
    renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
document.getElementById("filterAll").addEventListener("click", () => renderTasks("all"));
document.getElementById("filterPending").addEventListener("click", () => renderTasks("pending"));
document.getElementById("filterDone").addEventListener("click", () => renderTasks("done"));
