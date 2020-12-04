import getTodoProjectsFromLocalStorage from "../utils/storage-utility.js";
import { Project } from "../models/project.js";
import { buildTodosContainer } from "./todo-dom.js";

import { NIL as UUID_NIL } from "uuid";
import { UIkit } from "uikit";

export function checkForProjects() {
  if (getTodoProjectsFromLocalStorage() == null) {
    let defaultProject = new Project("Default", UUID_NIL);
    defaultProject.save();
  }
}

export function saveProject() {
  let projectName = document.querySelector(
    "#create-project form input#projectName"
  );
  if (projectName.value == "") {
    UIkit.notification("Project name should not be empty", {
      status: "danger",
    });
  } else {
    let newProject = new Project(projectName.value);
    newProject.save();
  }
  projectName.value = "";
  setProjectsDropdown();
  buildProjectsContainer();
}

export function buildProjectsContainer() {
  let projectsContainer = document.querySelector(
    "#projects .projects-container"
  );
  projectsContainer.removeChild(projectsContainer.children[0]);

  let projectsList = document.createElement("ul");
  projectsContainer.appendChild(projectsList);

  let todoProjects = getTodoProjectsFromLocalStorage();
  Object.keys(todoProjects).forEach((projectId) => {
    let projectsListItem = document.createElement("li");

    let projectDiv = document.createElement("div");
    projectDiv.classList.add("uk-card", "uk-card-hover");

    let projectP = document.createElement("p");
    projectP.appendChild(
      document.createTextNode(todoProjects[projectId].project.name)
    );
    projectP.addEventListener("click", () => {
      buildTodosContainer(projectId);
    });

    let projectDeleteBtn = document.createElement("btn");
    projectDeleteBtn.classList.add("uk-button");
    projectDeleteBtn.setAttribute("uk-icon", "icon: close");
    projectDeleteBtn.addEventListener("click", () => deleteProject(projectId));

    projectDiv.appendChild(projectP);
    projectDiv.appendChild(projectDeleteBtn);

    projectsListItem.appendChild(projectDiv);
    projectsList.appendChild(projectsListItem);
  });
  projectsContainer.appendChild(projectsList);
}

function deleteProject(projectId) {
  let todoProjects = getTodoProjectsFromLocalStorage();
  delete todoProjects[projectId];
  localStorage.setItem("todoProjects", JSON.stringify(todoProjects));
  buildProjectsContainer();
}

export function setProjectsDropdown() {
  setCreateTodoProjectsDropdown();
  setUpdateTodoProjectsDropdown();
}

function setCreateTodoProjectsDropdown() {
  let projectsDropdownContainer = document.getElementById(
    "projectsDropdownContainer"
  );
  document.querySelector("#create-todo select#project").remove();

  let projectsDropdown = getTodoProjectsDropdown();
  projectsDropdown.setAttribute("id", "project");

  projectsDropdownContainer.appendChild(projectsDropdown);
}

function setUpdateTodoProjectsDropdown() {
  let updateTodoProjectsDropdownContainer = document.getElementById(
    "updateTodoProjectsDropdownContainer"
  );
  document.querySelector("#update-todo select#updateTodoProject").remove();

  let todoProjectsDropdown = getTodoProjectsDropdown();
  todoProjectsDropdown.setAttribute("id", "updateTodoProject");

  updateTodoProjectsDropdownContainer.appendChild(todoProjectsDropdown);
}

function getTodoProjectsDropdown() {
  let todoProjectsDropdown = document.createElement("select");
  todoProjectsDropdown.classList.add("uk-input");

  let todoProjects = getTodoProjectsFromLocalStorage();
  Object.keys(todoProjects).forEach((projectId) => {
    let option = document.createElement("option");
    let optionText = document.createTextNode(
      todoProjects[projectId]["project"]["name"]
    );
    option.setAttribute("value", projectId);
    option.appendChild(optionText);
    todoProjectsDropdown.appendChild(option);
  });
  return todoProjectsDropdown;
}
