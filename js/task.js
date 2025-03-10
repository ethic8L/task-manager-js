class Task{
    constructor(id, text, status = "pending"){
        this.id = id;
        this.text = text;
        this.status = status; // pending lub done
        this.createdAt = new Date();
    }

    toggleStatus(){
        this.status = this.status === "pending" ? "done" : "pending";
    }
}