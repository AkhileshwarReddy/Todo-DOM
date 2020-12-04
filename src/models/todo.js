import {v4 as uuid4} from "uuid";

class Todo {
  constructor(
    title,
    description,
    dueDate,
    priority = 3,
    projectId = 0,
    id = uuid4(),
    isCompleted = false
  ) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.priority = priority;
    this.isCompleted = isCompleted;
    this.projectId = projectId;
  }

  save() {
    let todoProjects = JSON.parse(localStorage.getItem("todoProjects"));

    if (todoProjects[this.projectId]["todos"] == null) {
      todoProjects[this.projectId]["todos"] = [];
    }

    todoProjects[this.projectId]["todos"].push({
      id: this.id,
      title: this.title,
      dueDate: this.dueDate,
      description: this.description,
      priority: this.priority,
      isCompleted: this.isCompleted,
      projectId: this.projectId,
    });
    
    localStorage.setItem("todoProjects", JSON.stringify(todoProjects));
  }
}

export default Todo;
