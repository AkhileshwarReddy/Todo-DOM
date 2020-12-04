function getTodoProjectsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("todoProjects"))
}

export default getTodoProjectsFromLocalStorage;
