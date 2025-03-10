class TaskManager {
    constructor(){
        this.tasks = this.loadFromLocalStorage();
        this.currentUser = this.loadCurrentUser();
        this.nextId = this.loadNextId();
    }

    loadNextId(){
        const userTasks = this.tasks.filter(task => task.user === this.currentUser);
        if (userTasks.length === 0) return 1; // Jeśli nie ma zadań, to zaczynamy od 1
        return Math.max(...userTasks.map(task => task.id)) + 1; // W przeciwnym wypadku zwracamy największe ID + 1
    }

    saveNextId(){
        localStorage.setItem(`nextId_${this.currentUser}`, this.nextId);
    }

    addTask(text, priority, category){
        const id = this.nextId++;
        const newTask = new Task(id, text, "pending", priority, category, this.currentUser);
        this.tasks.push(newTask);
        this.saveNextId();
        return newTask;
    }

    getUserTasks(){
        return this.tasks.filter(task => task.user === this.currentUser);
    }


    removeTask(id){
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
        this.nextId = this.loadNextId(); // Aktualizacja nextId
        this.saveNextId();
    }

    removeAllTasks() {
        this.tasks = this.tasks.filter(task => task.user !== this.currentUser);
        this.saveToLocalStorage();
        this.nextId = 1; // Resetujemy nextId
        this.saveNextId();
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
        localStorage.setItem("currentUser", this.currentUser);
    }

    loadFromLocalStorage(){
        const data = localStorage.getItem("tasks");
        return data ? JSON.parse(data) : [];
    }

    loadCurrentUser(){
        return localStorage.getItem("currentUser") || "Anonim";
    }

    setCurrentUser(user){
        this.currentUser = user;
        this.nextId = this.loadNextId(); // Aktualizacja nextId
        this.saveToLocalStorage();
    }
}