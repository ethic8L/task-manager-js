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

        li.draggable = true;
        li.setAttribute("data-id", task.id);

        li.innerHTML = `
            <span class="task-text">${task.text}</span> 
            <span class="priority">(${task.priority})</span> 
            <span class="category">[${task.category}]</span>
            <button onclick="toggleTask(${task.id})">✓</button>
            <button onclick="editTask(${task.id})">✏️</button>
            <button onclick="removeTask(${task.id})">❌</button>
            
        `;

        li.addEventListener("dragstart", dragStart);
        li.addEventListener("dragover", dragOver);
        li.addEventListener("drop", drop);

        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    const priority = document.getElementById("taskPriority").value;
    const category = document.getElementById("taskCategory").value;

    if (!text) return;

    taskManager.addTask(text, priority, category);
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

let draggedTask = null;

function dragStart(event) {
    draggedTask = event.target;
    event.dataTransfer.setData("text/plain", draggedTask.getAttribute("data-id"));
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event){
    event.preventDefault();
    const targetTask = event.target.closest(".task");
    if (!targetTask || targetTask === draggedTask) return;

    const draggedId = parseInt(draggedTask.getAttribute("data-id"));
    const targetId = parseInt(targetTask.getAttribute("data-id"));

    const draggedIndex = taskManager.tasks.findIndex(task => task.id === draggedId);
    const targetIndex = taskManager.tasks.findIndex(task => task.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1){
        const [movedTask] = taskManager.tasks.splice(draggedIndex, 1);
        taskManager.tasks.splice(targetIndex, 0, movedTask);
        taskManager.saveToLocalStorage();
        renderTasks();
    }
}

// Funkcja edycji zadania

function editTask(id){
    const task = taskManager.tasks.find(task => task.id === id);
    if (!task) return;

    const li = document.querySelector(`[data-id="${id}"]`);
    if (!li) return;

    // Tworzymy formularz edycji w miejscu zadania

    li.innerHTML = `
        <input type="text"  id="editText-${id}" value="${task.text}" >
        <select id="editPriority-${id}">
            <option value="low" ${task.priority === "low" ? "selected" : ""}>Niski</option>
            <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Średni</option>
            <option value="high" ${task.priority === "high" ? "selected" : ""}>Wysoki</option>
        </select>
        <select id="editCategory-${id}">
            <option value="praca" ${task.category === "praca" ? "selected" : ""}>Praca</option>
            <option value="nauka" ${task.category === "nauka" ? "selected" : ""}>Nauka</option>
            <option value="hobby" ${task.category === "hobby" ? "selected" : ""}>Hobby</option>
        </select>
        <button onclick="saveTask(${id})">💾 Zapisz</button>
        <button onclick="renderTasks()">❌ Anuluj</button>
        `
}

// Funkcja zapisu zadania po edycji

function saveTask(id){
    const task = taskManager.tasks.find(task => task.id === id);
    if (!task) return;

    const newText = document.getElementById(`editText-${id}`).value.trim();
    const newPriority = document.getElementById(`editPriority-${id}`).value;
    const newCategory = document.getElementById(`editCategory-${id}`).value;

    if (!newText) return;

    task.text = newText;
    task.priority = newPriority;
    task.category = newCategory;

    taskManager.saveToLocalStorage();
    renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
document.getElementById("filterAll").addEventListener("click", () => renderTasks("all"));
document.getElementById("filterPending").addEventListener("click", () => renderTasks("pending"));
document.getElementById("filterDone").addEventListener("click", () => renderTasks("done"));
