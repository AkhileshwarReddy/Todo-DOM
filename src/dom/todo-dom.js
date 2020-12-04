import Todo from "../models/todo.js"
import getTodoProjectsFromLocalStorage from "../utils/storage-utility.js";

import { UIkit } from "uikit";
import { NIL as UUID_NIL } from "uuid";
import { format } from "date-fns";

export function buildTodosContainer(projectId = UUID_NIL) {
    let todosContainer = document.querySelector("#todos .todos-container");
    let oldTodosList = document.querySelector("#todos .todos-container ul");
    if(oldTodosList != null) {
        oldTodosList.remove();
    }

    let todoList = document.createElement('ul');

    let todoProjects = getTodoProjectsFromLocalStorage();
    if(!todoProjects[projectId].hasOwnProperty("todos")) {
        return;
    }
    let todos = todoProjects[projectId]["todos"];
    let project = todoProjects[projectId]["project"];

    for(let todo of todos) {
        let todolistIem = document.createElement("li");
        todolistIem.classList.add("uk-card", "uk-card-hover");

        let todoDiv = document.createElement('div');
        todoDiv.classList.add("todo");
        todolistIem.appendChild(todoDiv);

        let todoStatusIcon = document.createElement("box-icon");
        todoStatusIcon.setAttribute("id", "check-circle");
        todoStatusIcon.setAttribute("name", todo.isCompleted ? "check-circle" : "circle");
        if(!todo.isCompleted) {
            switch(todo.priority) {
                case 1: todoStatusIcon.setAttribute("color", "red");
                        break;
                case 2: todoStatusIcon.setAttribute("color", "orange");
                        break;
                case 3: todoStatusIcon.setAttribute("color", "black");
                        break;
            }
        } else {
            todoStatusIcon.setAttribute("color", "green");
        }
        todoStatusIcon.addEventListener("click", () => {
            completeTodo(todo.id, projectId); 
        });
        todoDiv.appendChild(todoStatusIcon);

        let todoTitle = document.createElement('p');
        let todoTitleText = document.createTextNode(todo.title);
        todoTitle.setAttribute("uk-toggle", "mode: click; target: #todo-detail");
        todoTitle.addEventListener("click", ()=> {
            displayTodo(todo, project);
        });
        todoTitle.appendChild(todoTitleText);
        todoDiv.appendChild(todoTitle);

        let todoActionsDiv = document.createElement("div");
        todoActionsDiv.classList.add("todo-actions");

        let deleteTodoIcon = document.createElement("box-icon");
        deleteTodoIcon.setAttribute("type", "solid");
        deleteTodoIcon.setAttribute("name", "trash");
        deleteTodoIcon.addEventListener('click', () => {
            deleteTodo(todo.id, projectId);
        });
        todoActionsDiv.appendChild(deleteTodoIcon);

        let editTodoIcon = document.createElement("box-icon");
        editTodoIcon.setAttribute("name", "edit-alt");
        editTodoIcon.setAttribute("uk-toggle", "target: #update-todo");
        editTodoIcon.addEventListener("click", () => {
            editTodo(todo.id, projectId);
        });
        todoActionsDiv.appendChild(editTodoIcon);

        let prioritiesDiv = document.createElement("div");
        prioritiesDiv.classList.add("uk-inline");

        let prioritiesDropdownBtn = document.createElement("button");
        prioritiesDropdownBtn.setAttribute("uk-icon", "chevron-down");
        prioritiesDiv.appendChild(prioritiesDropdownBtn);

        let prioritiesDropdown = document.createElement("div");
        prioritiesDropdown.setAttribute("uk-dropdown", "mode: click; pos: bottom-left;");

        let prioritiesHeader = document.createElement("p");
        let boldHeader = document.createElement("b");
        boldHeader.appendChild(
            document.createTextNode("Priority")
        );
        prioritiesHeader.appendChild(boldHeader);
        prioritiesDropdown.appendChild(prioritiesHeader);

        let prioritiesButtonGroup = document.createElement("div");
        prioritiesButtonGroup.classList.add("uk-button-group", "priority-flags");

        let highPriority = document.createElement("button");
        let highPriorityBtnText = document.createTextNode("High");
        highPriority.appendChild(highPriorityBtnText);
        highPriority.classList.add("uk-button", "priority-high");
        highPriority.addEventListener("click", () => {
            setPriority(todo.id, projectId, 1);
        });
        prioritiesButtonGroup.appendChild(highPriority);

        let mediumPriority = document.createElement("button");
        let mediumPriorityBtnText = document.createTextNode("Medium");
        mediumPriority.appendChild(mediumPriorityBtnText);
        mediumPriority.classList.add("uk-button", "priority-medium");
        mediumPriority.addEventListener("click", () => {
            setPriority(todo.id, projectId, 2);
        });
        prioritiesButtonGroup.appendChild(mediumPriority);

        let lowPriority = document.createElement("button");
        let lowPriorityBtnText = document.createTextNode("Low");
        lowPriority.appendChild(lowPriorityBtnText);
        lowPriority.classList.add("uk-button", "priority-low");
        lowPriority.addEventListener("click", () => {
            setPriority(todo.id, projectId, 3);
        });
        prioritiesButtonGroup.appendChild(lowPriority);

        prioritiesDropdown.appendChild(prioritiesButtonGroup);
        prioritiesDiv.appendChild(prioritiesDropdown);
        todoActionsDiv.appendChild(prioritiesDiv);
        todoDiv.appendChild(todoActionsDiv);
        todoList.append(todolistIem);
    };
    
    todosContainer.appendChild(todoList)
}

function deleteTodo(todoId, projectId) {
    let todoProjects = getTodoProjectsFromLocalStorage();
    let todos = todoProjects[projectId]["todos"];
    let index = -1;
    for(let i in todos) {
        if(todos[i].id == todoId) {
            index = i;
            break;
        }
    }
    todos.splice(index, 1);
    todoProjects[projectId]["todos"] = todos;
    localStorage.setItem("todoProjects", JSON.stringify(todoProjects));
    buildTodosContainer(projectId);
}

function editTodo(todoId, projectId) {
    let todoProjects = getTodoProjectsFromLocalStorage();
    let todos = todoProjects[projectId]["todos"];
    let todo = todos.find(x => x.id == todoId);
    document.getElementById("updateTodoId").value = todo.id;
    document.getElementById("updateTodoTitle").value = todo.title;
    document.getElementById("updateTodoDescription").value = todo.description;
    document.getElementById("updateTodoDueDate").value = todo.dueDate;
    document.getElementById("updateTodoProject").value = todo.projectId;
    document.getElementById("updateTodoPriority").value = todo.priority;
}

export function updateTodo() {
    let todoProjects = getTodoProjectsFromLocalStorage();
    let updateTodoId = document.getElementById("updateTodoId").value;
    let projectId = document.getElementById("updateTodoProject").value;
    let todo = todoProjects[projectId].todos.find(todo => todo.id == updateTodoId);
    
    todo.title = document.getElementById("updateTodoTitle").value;
    todo.description = document.getElementById("updateTodoDescription").value;
    todo.dueDate = document.getElementById("updateTodoDueDate").value;
    todo.projectId = projectId;
    todo.priority = parseInt(document.getElementById("updateTodoPriority").value);

    todoProjects[projectId].todos.forEach(t => {
        if(t.id == todo.id) {
            t = todo;
        }
    });
    
    localStorage.setItem("todoProjects", JSON.stringify(todoProjects));
    buildTodosContainer(projectId);
}

function completeTodo(todoId, projectId) {
    let todoProjects = getTodoProjectsFromLocalStorage();
    let todos = todoProjects[projectId]["todos"];
    for(let todo of todos) {
        if(todo.id == todoId) {
            todo.isCompleted = !todo.isCompleted;
            break;
        }
    }
    todoProjects[projectId]["todos"] = todos;
    localStorage.setItem("todoProjects", JSON.stringify(todoProjects));
    buildTodosContainer(projectId);
}

function setPriority(todoId, projectId, priority) {
    let todoProjects = getTodoProjectsFromLocalStorage();
    let todos = todoProjects[projectId]["todos"];
    for(let todo of todos) {
        if(todo.id == todoId) {
            todo.priority = priority;
            break;
        }
    }
    todoProjects[projectId]["todos"] = todos;
    localStorage.setItem("todoProjects", JSON.stringify(todoProjects));
    buildTodosContainer(projectId);
}

export function saveTodo() {
    let todoForm = document.querySelector("#create-todo form");
    let todoTitle = todoForm.querySelector("#title")?.value;
    let description = todoForm.querySelector("#description").value;
    let dueDate = todoForm.querySelector("#dueDate").value;
    let project = todoForm.querySelector("#project").value;
    let priority = todoForm.querySelector("#priority").value;
    if(todoTitle === "" || dueDate == null) {
        UIkit.notification("Title and Due date are mandatory", {status: "danger"});
    } else {
        let newTodo = new Todo(todoTitle, description, dueDate, parseInt(priority), project);
        newTodo.save();
    }
    todoForm.querySelector("#title").value="";
    todoForm.querySelector("#description").value = "";
    todoForm.querySelector("#dueDate").value = new Date();
    todoForm.querySelector("#project").value = UUID_NIL;
    todoForm.querySelector("#priority").value = 3;
}

function displayTodo(todo, project) {
    document.getElementById("todoDetailTitle").textContent = todo.title;
    document.getElementById("todoDetailDueDate").textContent = format(new Date(todo.dueDate), 'hh:mm aa dd-MM-yyyy');
    document.getElementById("todoDetailProject").textContent = project.name;
    switch(parseInt(todo.priority)) {
        case 1: 
            document.getElementById("todoDetailPriority").textContent = "HIGH";
            document.getElementById("todoDetailPriority").style.color = "red";
            break;
        case 2: 
            document.getElementById("todoDetailPriority").textContent = "MEDIUM";
            document.getElementById("todoDetailPriority").style.color = "orange";
            break;
        case 3: 
            document.getElementById("todoDetailPriority").textContent = "LOW";
            document.getElementById("todoDetailPriority").style.color = "black";
            break;
    }
}
