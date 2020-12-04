import {
  checkForProjects,
  saveProject,
  buildProjectsContainer,
  setProjectsDropdown,
} from "./dom/project-dom.js";

import { saveTodo, buildTodosContainer, updateTodo } from "./dom/todo-dom.js";

checkForProjects();
initialize();
document.getElementById("saveProjectBtn").addEventListener("click", saveProject);
document.getElementById("saveTodoBtn").addEventListener("click", saveTodo);
document.getElementById("updateTodoBtn").addEventListener('click', updateTodo);

function initialize() {
  setProjectsDropdown();
  buildProjectsContainer();
  buildTodosContainer();
}
