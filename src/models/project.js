import { v4 as uuid4 } from "uuid";

export class Project {
    constructor(name, id = uuid4()) {
        this.id = id;
        this.name = name;
    }

    save() {
        let todoProjects = JSON.parse(localStorage.getItem("todoProjects"));

        if(todoProjects == null) {
            todoProjects = {}
        }

        let newProject = { 
            project : {
                id: this.id,
                name: this.name
            }
        }
        todoProjects[newProject.project.id] = newProject;
        localStorage.setItem('todoProjects', JSON.stringify(todoProjects));
    }
}
