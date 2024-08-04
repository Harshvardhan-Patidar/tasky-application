const state={
    taskList:[],
};

const taskContents=document.querySelector(".task_contents");
const taskModel=document.querySelector(".task_modal_body");

const ourcards=({id,title,description,type,url})=>`
    <div class="col-md-6 col-lh-4 mt-3" id=${id}>
        <div class="card shadow task_card">
            <div class="card-header df-flex justify-content-end task_card_header">
                <button type="button" class="btn btn-outlinr-primary mr-3" name=${id}>
                <i class="fas fa-pencil-alt" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outlinr-danger mr-3" name=${id}>
                <i class="fas fa-trash-alt" name=${id}></i>
                </button>
            </div>
            <div class="card-body>
            ${
                url &&
                `<img width="100%" src=${url} alt="Card Image" class="card-img-top md-3 rounded-lg">`
            }
            <h4 class="card-title" tasik_card-title>${title}</h4>
            <p class="description trim-3-lines text-muted">${description}</p>
            <div class="tags text-white d-flex flex-wrap">
                <span class="badge bg-primary m-1">${type}</span>
            </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask">Open Task</button>
            </div>
        </div>
    </div>
`;

const opencard=({id,title,description,url})=>{
    const date=new Date(parseInt(id));
    return `
        <div id=${id}>
            ${
                url &&
                `<img width="100%" src=${url} alt="Card Image" class="img-fluid place_holder_image mb-3"/>`
            }
            <strong>Created on: ${date.toDateString()}</strong>
            <h2 class="my-3">${title}</h2>
            <p class="text-muted">${description}</p>
        </div>
    `;
};

const storeData=()=>{
    localStorage.setItem(
        'Task', JSON.stringify({
            tasks: state.taskList,
        })
    );
};

const loadInitialData=()=>{
    const localStoragecopy=JSON.parse(localStorage.taskList);
    if(localStoragecopy){
        state.taskList=localStoragecopy.Task;
    }
    state.taskList.map((cardDate)=>{
        taskContents.insertAdjacentHTML("beforeend",ourcards(cardDate));
    })
}

const updatecard=(Event)=>{
    const id=`${Date.now()}`;
    const input={
        url:document.getElementById("imageURL").ariaValueMax,
        title:document.getElementById("taskTitle").ariaValueMax,
        tags:document.getElementById("tags").ariaValueMax,
        taskDescription:document.getElementById("taskDescription").ariaValueMax
    };

    if(input.title=="" || input.tags=="" || input.taskDescription==""){
        return alert("Please the fields")
    }

    taskContents.insertAdjacentHTML("beforeend",opencard({...input,id}));
    state.taskList.push({...input,id});
    storeData();
};