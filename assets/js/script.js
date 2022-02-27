var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
// empty array to hold the tasks in local storage for persistence
var tasks = [];

var completeEditTask = function (taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array and task object with new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === jparseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  saveTasks();

  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

var taskFormHandler = function () {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // determines whether is a new task or an edit
  var isEdit = formEl.hasAttribute("data-task-id");
  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };

    createTaskEl(taskDataObj);
  }

  // package up data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
  };

  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  // clear the form after submission
  formEl.reset();

  // send it as an argument to createTaskEl
};

//
//
// ***********************************************************************
// This function has a lot of the stuff we need for the loadTasks function
//
//
var createTaskEl = function (taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute

  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  listItemEl.appendChild(taskInfoEl);
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  tasksToDoEl.appendChild(listItemEl);
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  saveTasks();

  // increase task counter for next unique id
  taskIdCounter++;
};
//
//
//
// This function has a lot of the stuff we need for the loadTasks function
// ***********************************************************************
//

var createTaskActions = function (taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  // create dropdown or select element
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  // create a for loop to handle the select element
  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
};

var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();
  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks();
};

var editTask = function (taskId) {
  // get task list item element
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};

var taskStatusChangeHandler = function (event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "Completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  // update task's status in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
  saveTasks();
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function (event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

// save tasks to local storage
var saveTasks = function () {
  localStorage.setItem("tasks", tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
  var tasks = localStorage.getItem("tasks");
  tasks = JSON.parse(tasks);
  for (var i = 0; i < tasks.length; i++) {

    // check if tasks is null
    // if (tasks === null) {
    //   tasks = []; 
    //   return false;
    // };

    tasks[i].id = taskIdCounter++;
    // console.log(tasks[i]);

    // create li element and store it in a variable called listItemEl
    var listItemEl = document.createElement("li");

    // give a classname attribute of task-item
    listItemEl.className = "task-item";

    // Using setAttribute give it a data-task-id attribute with a value of tasks[i].id
    listItemEl.setAttribute("data-task-id", tasks[i].id);
    // console.log(listItemEl);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    var taskActionsEl = (createTaskActions(tasks[i].id));
    listItemEl.appendChild(taskActionsEl);
    
    // check if tasks-i-status is equal to "to do", if so make these changes and append appropriately
    if (tasks[i].status === "to do") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.appendChild(listItemEl);

    // else if tasks-i-status is equal to "in progress", if so make these changes and append appropriately  
    } else if (tasks[i].status === "in progress") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.appendChild(listItemEl);

    // else if tasks-i-status is equal to "completed", if so make these changes and append appropriately  
    } else if (tasks[i].status === "completed") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.appendChild(listItemEl);
    }
    console.log(listItemEl);
    

   
   
  }
};
loadTasks();

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
