const taskManager = new TaskManager();
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskText");
const addTaskBtn = document.getElementById("addTask");
const userSelect = document.getElementById("userSelect");

userSelect.value = taskManager.currentUser;

//  Renderowanie zadań
function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    
    const sortedTasks = [...taskManager.getUserTasks()].sort((a, b) => a.id - b.id); // Sortowanie po ID

    sortedTasks.forEach(task => {
        if (filter !== "all" && task.status !== filter) return;

        const li = document.createElement("li");
        li.classList.add("task");
        if (task.status === "done") li.classList.add("done");

        li.draggable = true;
        li.setAttribute("data-id", task.id);
        li.style.opacity = "0"; // Początkowa niewidoczność

        li.innerHTML = `
            <span class="task-id">#${task.id}</span>
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

        // Efekt pojawiania się
        setTimeout(() => {
            li.style.opacity = "1";
            li.style.transform = "translateY(0)";
        }, 50);
    });
}

//  Dodawanie zadania
function addTask() {
    const text = taskInput.value.trim();
    const priority = document.getElementById("taskPriority").value;
    const category = document.getElementById("taskCategory").value;

    if (!text) return;

    taskManager.addTask(text, priority, category);
    taskInput.value = "";
    renderTasks();
}

//  Usuwanie zadania
function removeTask(id) {
    taskManager.removeTask(id);
    renderTasks();
}

//  Oznaczanie jako ukończone
function toggleTask(id) {
    taskManager.toggleTaskStatus(id);
    renderTasks();
}

//  Drag & Drop
let draggedTask = null;

function dragStart(event) {
    draggedTask = event.target;
    event.dataTransfer.setData("text/plain", draggedTask.getAttribute("data-id"));
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const targetTask = event.target.closest(".task");
    if (!targetTask || targetTask === draggedTask) return;

    const draggedId = parseInt(draggedTask.getAttribute("data-id"));
    const targetId = parseInt(targetTask.getAttribute("data-id"));

    const draggedIndex = taskManager.tasks.findIndex(task => task.id === draggedId);
    const targetIndex = taskManager.tasks.findIndex(task => task.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
        const [movedTask] = taskManager.tasks.splice(draggedIndex, 1);
        taskManager.tasks.splice(targetIndex, 0, movedTask);

        let userTasks = taskManager.getUserTasks();
        userTasks.forEach((task, index) => {
            task.id = index + 1;
        });

        taskManager.saveToLocalStorage();
        renderTasks();
    }
}

//  Edycja zadania
function editTask(id) {
    const task = taskManager.tasks.find(task => task.id === id);
    if (!task) return;

    const li = document.querySelector(`[data-id="${id}"]`);
    if (!li) return;

    li.innerHTML = `
        <div class="flex items-center gap-2">
            <input type="text" id="editText-${id}" value="${task.text}" 
                class="w-1/3 p-1 text-sm rounded bg-gray-700 text-white border border-gray-500 focus:ring focus:ring-blue-500">
            
            <select id="editPriority-${id}" class="w-1/5 p-1 text-sm rounded bg-gray-700 text-white border border-gray-500">
                <option value="low" ${task.priority === "low" ? "selected" : ""}>Niski</option>
                <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Średni</option>
                <option value="high" ${task.priority === "high" ? "selected" : ""}>Wysoki</option>
            </select>

            <select id="editCategory-${id}" class="w-1/5 p-1 text-sm rounded bg-gray-700 text-white border border-gray-500">
                <option value="praca" ${task.category === "praca" ? "selected" : ""}>Praca</option>
                <option value="nauka" ${task.category === "nauka" ? "selected" : ""}>Nauka</option>
                <option value="hobby" ${task.category === "hobby" ? "selected" : ""}>Hobby</option>
            </select>

            <button onclick="saveTask(${id})" class="px-2 py-1 text-xs bg-green-500 rounded hover:bg-green-600">💾</button>
            <button onclick="renderTasks()" class="px-2 py-1 text-xs bg-red-500 rounded hover:bg-red-600">❌</button>
        </div>
    `;
}


//  Zapis edytowanego zadania
function saveTask(id) {
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

//  Zmiana użytkownika
function changeUser() {
    const selectedUser = userSelect.value;
    taskManager.setCurrentUser(selectedUser);
    renderTasks();
}

//  Event Listenery
addTaskBtn.addEventListener("click", addTask);
document.getElementById("filterAll").addEventListener("click", () => renderTasks("all"));
document.getElementById("filterPending").addEventListener("click", () => renderTasks("pending"));
document.getElementById("filterDone").addEventListener("click", () => renderTasks("done"));
document.getElementById("userSelect").addEventListener("change", changeUser);

document.getElementById("clearAllTasks").addEventListener("click", () => {
    taskManager.removeAllTasks();
    renderTasks();
});

