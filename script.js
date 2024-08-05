const state = {
    taskList: [],
};

const taskModal = document.querySelector(".task__modal__body");
const taskContents = document.querySelector(".task__contents");

const cardsData = ({ id, title, description, type, url }) => `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
      <div class='card shadow-sm task__card'>
      
        <div class='card-header d-flex justify-content-end task__card__header'>
            <button type='button' class='btn btn-outline-primary mr-1.5' name=${id} onclick="cardEdit.apply(this,arguments)">
                <i class='fas fa-pencil-alt name=${id}'></i>
            </button>
            &nbsp&nbsp
             <button type='button' class='btn btn-outline-danger mr-1.5' name=${id} onclick="cardDelete.apply(this,arguments)">
                <i class='fas fa-trash-alt name=${id}'"></i>
            </button>
        </div>
        <div class='card-body'>
            ${
                url ?
                `<img width='100%' src=${url} alt='Card Image' class='card-img-top md-3 rounded-lg' />`:
                `<img width='100%' src="https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-0.jpg" alt='Card Image' class='card-img-top md-3 rounded-lg' />`
    }
            <h4 class='card-title task__card__title'>${title}</h4>
            <p class='description trim-3-lines text-muted'>${description}</p>
            <div class='tags text-white d-flex flex-wrap'>
              <span class='badge bg-primary m-1'>${type}</span>
            </div>
        </div>
        <div class='card-footer'>
            <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle="modal" data-bs-target="#showTask" onclick="openDetails.apply(this,arguments)" id=${id}>Open Task</button>
        </div>
      </div>
    </div>
  `;

const cardsDetail = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
       ${
        url ?
        `<img width='100%' src=${url} alt='Card Image' class='img-fluid place__holder__image mb-3' />`:
        `<img width='100%' src="https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-0.jpg" alt='Card Image' class='img-fluid place__holder__image mb-3' />`
        }
       <strong class='text-muted text-sm'>Created on: ${date.toDateString()}</strong>
       <h2 class='my-3'>${title}</h2>
       <p class='text-muted'>${description}</p>
    </div>
    `;
};

const storeDataLocally = () => {
    localStorage.setItem(
        "task",
        JSON.stringify({
            tasks: state.taskList,
        })
    );
};

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);

    if (localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", cardsData(cardDate));
    });
};

const cardsUpdate = (event) => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById("imageUrl").value,
        title: document.getElementById("taskTitle").value,
        type: document.getElementById("tags").value,
        description: document.getElementById("taskDescription").value,
    };

    if(input.url=="" || input.title=="" || input.type=="" || input.description==""){
        return alert("Please fill all the fields");
    }

    taskContents.insertAdjacentHTML("beforeend", cardsData({ ...input, id }));
    state.taskList.push({ ...input, id });

    storeDataLocally();
};

const openDetails=(e)=>{
    if(!e){
        e=window.event;
    }
    const getTask=state.taskList.find(({id})=>{
        id===e.target.id
    })
    taskModal.innerHTML=cardsDetail({getTask});
}

const cardDelete=(e)=>{
    const targetId=e.target.getAttribute("name");
    const types=e.target.tagName;
    const removeCard=state.taskList.filter(({id})=>{
        id!==targetId
    });
    state.taskList=removeCard;
    storeDataLocally();

    if(types=="BUTTON"){
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    };
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
};

const cardEdit=(e)=>{
    const targetId=e.target.getAttribute("name");
    const types=e.target.tagName;
    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;
    
    if(types=="BUTTON"){
        parentNode=e.target.parentNode.parentNode;
    }else{
        parentNode=e.target.parentNode.parentNode.parentNode;
    }
    taskTitle=parentNode.childNodes[3].childNodes[3];
    taskDescription=parentNode.childNodes[3].childNodes[5];
    taskType=parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton=parentNode.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    submitButton.setAttribute("onclick","saveEdit.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML="Save Changes";
}

const saveEdit=(e)=>{
    if(!e) e=window.event;
    const targetId=e.target.id;
    const parentNode=e.target.parentNode.parentNode;

    
    const taskTitle=parentNode.childNodes[3].childNodes[3];
    const taskDescription=parentNode.childNodes[3].childNodes[5];
    const taskType=parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton=parentNode.childNodes[5].childNodes[1];

    const updateChanges={
        taskTitle:taskTitle.innerHTML,
        taskDescription:taskDescription.innerHTML,
        taskType:taskType.innerHTML
    };

    let taskListCopy=state.taskList;
    taskListCopy=taskListCopy.map((task)=>
        task.id==targetId
            ?{
                id:task.id,
                title:updateChanges.taskTitle,
                description:updateChanges.taskDescription,
                type:updateChanges.taskType,
                url:task.url
            }
            :task
    );
    state.taskList=taskListCopy;
    storeDataLocally();

    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");
    submitButton.setAttribute("onclick","openDetails.apply(this,arguments)");
    submitButton.setAttribute("data-bs-toggle","modal");
    submitButton.setAttribute("data-bs-target","showTask");
    submitButton.innerHTML="Open Task";
};