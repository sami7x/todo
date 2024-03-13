// DOM elements
const taskInput = document.querySelector(".task-input input");
const filters = document.querySelectorAll(".filters span");
const clearAll =  document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;

let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach ((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if(todos){
    todos.forEach((todo, id) => {
      //if todo status is completed, set this isCompleted
        let isCompleted = todo.status == "completed" ? "checked" : "";
        if(filter == todo.status || filter == "all")
        {          
          li += `
          <li class="task">
          <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
              <p class="${isCompleted}">${todo.name}</p>
          </label>
  
          <div class="settings">
              <i onClick="showMenu(this)" class="uil uil-ellipsis-h"></i>
              <ul class="task-menu">
                  <li onclick="editTask(${id}, '${todo.name}')" ><i class="uil uil-pen"></i>Edit</li>
                  <li  onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
              </ul>
          </div>
          </li>
          `;
        }
  });
}
//displays the text insdie span incase of empty todo list
taskBox.innerHTML = li || `<spna>You don't have any todo.</spna>`;
}
showTodo("all");

function showMenu(selectedTask)
{
  // console.log(selectedTask);
  //getting task menu div
  let taskMenu =  selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", e => {
    //removing show class from the task menu on the document click
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function deleteTask(deleteId)
{
  //removing seleted task from array
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}

clearAll.addEventListener("click", () => {
  //removing all todos from array
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});

function editTask(taskId, taskName)
{
  // console.log(taskId, taskName);
  editId = taskId;
  isEditedTask= true;
  taskInput.value = taskName;
}


function updateStatus(selectedTask)
{
  // console.log(selectedTask);
  //getting paragraph that contains task name
  let taskName = selectedTask.parentElement.lastElementChild;
  if(selectedTask.checked)
  {
    taskName.classList.add("checked");
    todos[selectedTask.id].status="completed";
  }
  else{
    taskName.classList.remove("checked");
    todos[selectedTask.id].status="pending";

  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if(!isEditedTask)
    {
      // getting localStorage todo list
      if (!todos) {
        todos = [];
      }
      
          let taskInfo = { name: userTask, status: "pending" };
          todos.push(taskInfo); // adding new task into the todo list

    }
    else{
      isEditedTask= false;
      todos[editId].name= userTask;
    }

    taskInput.value = "";

    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});

