class Task{
    constructor(id, text, status = "pending", priority = "medium", category = "brak", user = "Anonim"){
        this.id = id;
        this.text = text;
        this.status = status;
        this.priority = priority;
        this.category = category;
        this.user = user;
        this.createdAt = new Date();
    }

    toggleStatus(){
        this.status = this.status === "pending" ? "done" : "pending";
    }
} 