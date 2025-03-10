class TaskManager {
    constructor(){
        this.tasks = [];
    }

    addTask(text){
        const id = Date.now();
        const newTask = new Task(id, text);
        this.tasks.push(newTask);
        return newTask;
    }

    removeTask(id){
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    toggleTaskStatus(id){
        const task = this.tasks.find(task => task.id === id);
        task.toggleStatus();
    }

    getFilteredTasks(filter){
        if (filter === "pending") return this.tasks.filter(task => task.status === "pending");
        if (filter === "done") return this.tasks.filter(task => task.status === "done");
        return this.tasks;
    }
}