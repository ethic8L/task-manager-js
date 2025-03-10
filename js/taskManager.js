class TaskManager {
    constructor(){
        this.tasks = this.loadFromLocalStorage();
    }

    addTask(text, priority = 'medium', category = 'brak'){
        const id = Date.now();
        const newTask = new Task(id, text, "pending", priority, category);
        this.tasks.push(newTask);
        this.saveToLocalStorage();
        return newTask;
    }

    removeTask(id){
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
    }

    toggleTaskStatus(id){
        const task = this.tasks.find(task => task.id === id);
        if (task){
            task.toggleStatus();
            this.saveToLocalStorage();
        }
    }

    getFilteredTasks(filter){
        if (filter === "pending") return this.tasks.filter(task => task.status === "pending");
        if (filter === "done") return this.tasks.filter(task => task.status === "done");
        return this.tasks;
    }

    saveToLocalStorage(){
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    loadFromLocalStorage(){
        const data = localStorage.getItem("tasks");
        return data ? JSON.parse(data) : [];
    }
}