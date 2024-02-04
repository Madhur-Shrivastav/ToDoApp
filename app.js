const state = {
  taskList: [],
};

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task_modal_body");

const htmlTaskContent = (task = { id, title, description, type, url }) => `
    <div class="col-md-6 col-lg-4 mt-3" id=${task.id} key=${task.id}>
        <div class="card shadow-sm task__card">
            <div class="card-header d-flex justify-content-end task_card_header">
                <button type="button" class="btn btn-outline-info mr-2" name=${
                  task.id
                } onclick='editTask.apply(this, arguments)'>
                    <i class="fas fa-pencil-alt" name=${task.id}></i>
                </button>
                <button type="button" class="btn btn-outline-danger mr-2" name=${
                  task.id
                } onclick='deleteTask.apply(this, arguments)'>
                    <i class="fas fa-trash-alt" name=${task.id}></i>
                </button>
            </div>
            <div class="card-body">
            ${
              task.url
                ? `<img width="100%" src=${task.url} alt="card image cap" class="card-image-top md-3 rounded-lg"/>`
                : `<img width="100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAACUC.../>`
            }
            <h4 class="card-title">${task.title}</h4>
            <p class="card-title trim-3-lines text-muted">${
              task.description
            }</p>
            <div class="tags text-white d-flex flex-wrap">
                <span class="badge bg-primary m-1">
                    ${task.type}
                </span>
            </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask" name=${
                  task.id
                } onclick='openTask.apply(this, arguments)'>
                    Open Task
                </button>
            </div>
        </div>
    </div>
`;

const htmlModalContent = (task = { id, title, description, url }) => {
  const date = new Date(parseInt(task.id));
  return `
    <div id=${task.id}>
     ${
       task.url
         ? `<img width="100%" src=${task.url} alt="card image cap" class="img-fluid md-3 rounded-lg"/>`
         : `<img width="100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAACUC.../>`
     }
            <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
            <h2 class="my-3">${task.title}</h2>
            <p class="lead">${task.description}</p>
    </div>
    `;
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "task",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

const loadInitialData = () => {
  if (localStorage.task) {
    console.log("localStorage.task:", localStorage.task);
    const localStorageCopy = JSON.parse(localStorage.task);
    state.taskList = localStorageCopy.tasks;

    state.taskList.forEach((task) => {
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(task));
    });

    console.log(state.taskList);
  } else {
    console.log("No tasks found in localStorage.");
  }
};

const handleSubmit = () => {
  const id = Date.now();
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    type: document.getElementById("tags").value,
  };

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlModalContent({ ...input, id })
  );
  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

const openTask = (event) => {
  if (!event) {
    event = window.event;
  }

  const targetId = event.target.getAttribute("name");
  console.log(targetId);
  console.log(state);
  const getTask = state.taskList.filter(function (id) {
    id === targetId;
  });
  // const getTask = [];
  // for (let i = 0; i < state.taskList.length; i++) {
  // if (state.taskList[i].id === targetId) {
  // getTask.push(state.taskList[i]);
  // }
  // }
  // const getTask = [];
  // state.taskList.forEach(function (task) {
  // if (task.id === targetId) {
  // getTask.push(task);
  // }
  // });

  console.log(getTask);
  taskModal.innerHTML = htmlModalContent(getTask);
};

const deleteTask = (event) => {
  if (!event) {
    event = window.event;
  }

  const targetId = event.target.getAttribute("name");
  const type = event.target.tagName;

  const newTaskList = state.taskList.filter(function (id) {
    id !== targetId;
  });
  state.taskList = newTaskList;
  console.log(state);

  updateLocalStorage();

  if (type === "BUTTON") {
    event.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  } else {
    event.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

const editTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let tags;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.querySelector(".card-title");
  taskDescription = parentNode.querySelector(".card-title.trim-3-lines");
  tags = parentNode.querySelector(".tags .badge");
  submitButton = parentNode.querySelector(".btn-outline-primary");

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  tags.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};
