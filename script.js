const date = document.querySelector('.input-date');
const textarea = document.querySelector('.input-toDo');
const error = document.getElementById('error-input');
const isImportant = document.querySelector('.important-tag-btn');
let isNowImportant;
const check = document.querySelector('.js-listing');
const valueToEdit = document.querySelector('.edit-input-toDo');
const dateToEdit = document.querySelector('.edit-input-date');
const allLists = document.querySelector('.js-all-lists');
const allImportantLists = document.querySelector('.js-important-lists');
const allNotImportantLists = document.querySelector('.js-not-important-lists');


let toDoList = JSON.parse(localStorage.getItem('listMemory')) || [];
addItems();


function setUpAdding(){
    document.getElementById('viewAddlist').style.display = 'flex';
}


function exitFromAdding(){
    document.getElementById('viewAddlist').style.display = 'none';
}

function exitFromEditing(){
    document.getElementById('editViewAddlist').style.display = 'none';
}


function addItems(){
    localStorage.setItem('listMemory', JSON.stringify(toDoList));

    
    if (toDoList.length === 0){
        check.innerHTML = '<p class="no-list">No items found</p>';
        return;     
    }


    let addingList = '';
    

    toDoList.forEach((toList,index) =>{
        const html = `
            <div class="list ${toList.important}">
                <div class="list-contents">
                    <div class="to-to-and-date">
                        <p>${toList.toDo}</p>
                        <div class="item-date">${toList.dateAcomplish}</div>
                    </div>
                    <div class="edit-and-delete">
                        <button class="edit" onclick="editList(${index})" >Edit</button>
                        <button class="delete" onclick="removeFromList(${index})">Delete</button>

                    </div>
                    <div class="created-at">
                        ${toList.dateCreated}
                    </div>

                </div>
            
             </div>`
            ;

    

        addingList += html;
    

    });

    isImportant.classList.remove('active');
    
    document.querySelector('.js-listing').innerHTML = addingList; 
};


//ADDING TO THE LIST
function addToDo(){ 
    const inpuThings = textarea.value;
    const inputDate = date.value;

    if (inpuThings === '' || inputDate === ''){
        error.style.visibility = 'visible';
        return;
    }

    if (!isImportant.classList.contains('active'))
        isNowImportant = 'none';
    else 
        isNowImportant = 'important';
       

    const todoListInformation = {
        toDo: inpuThings,
        dateAcomplish: dateAccomplish(inputDate),
        dateCreated: dateCreated(),
        important: isNowImportant
    }


    toDoList.push(todoListInformation);
    textarea.value = '';
    date.value = '';

    if (allNotImportantLists.classList.contains('active')){
        localStorage.setItem('listMemory', JSON.stringify(toDoList));
        filterNotImportantList();
    }
    else if (allImportantLists.classList.contains('active')){
        localStorage.setItem('listMemory', JSON.stringify(toDoList));
        filterImportantList();
    }
        
    else if (allLists.classList.contains('active'))
        addItems();


    exitFromAdding();
}

//IMPORTANT LIST TAG
isImportant.addEventListener('click',() => {
    if (!isImportant.classList.contains('active'))  
        isImportant.classList.add('active');

    else
       isImportant.classList.remove('active');
})



// EXIT NOTIFICATION
function underStand(){
    const error = document.getElementById('error-input');
    return error.style.visibility = 'hidden';
    
}


// Date Accomplish
function dateAccomplish(inputDate){
    const date = new Date(inputDate).toDateString();
    const generateCurrentDate = date;
    return generateCurrentDate;
}


// GENERATE DATE LIST ARE CREATED
function dateCreated(){
    const date = new Date().toDateString();
    const generateCurrentDate = `edited at ${date}`;
    return generateCurrentDate;
}

// CLEAR ALL EXISTING LIST
document.querySelector('.js-clear-all').addEventListener('click', () => {
    if (allImportantLists.classList.contains('active')) {
        toDoList = toDoList.filter(item => item.important !== 'important');
        filterImportantList();
    } else if (allNotImportantLists.classList.contains('active')) {
        toDoList = toDoList.filter(item => item.important !== 'none');
        filterNotImportantList();
    } else {
        toDoList = [];
        addItems();
    }
    localStorage.setItem('listMemory', JSON.stringify(toDoList));
});



function removeFromList(index) {
    if (allImportantLists.classList.contains('active')) {
        toDoList = toDoList.filter(item => item.important !== 'important' || toDoList.indexOf(item) !== index);
        filterImportantList();
    } else if (allNotImportantLists.classList.contains('active')) {
        toDoList = toDoList.filter(item => item.important !== 'none' || toDoList.indexOf(item) !== index);
        filterNotImportantList();
    } else {
        toDoList.splice(index, 1);
        addItems();
    }
    localStorage.setItem('listMemory', JSON.stringify(toDoList));
}

// FUNCTION THAT CONVERT STRING DATE INTO SHORT DATE
function reverToConsiseCalendar(date){
    const dateParts = date.split(' ');

    const months = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Aug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12'
    }

    const dateForParsing = `${dateParts[3]}-${months[dateParts[1]]}-${dateParts[2]}`;
    return dateForParsing;
    
}

// EDIT LIST, TAKES IN THE PREVIOUS VALUE 
function editList(index){
   document.querySelector('.edit-set-up-to-list').style.display = 'flex';

   let listToUpdate = toDoList;
    if (allImportantLists.classList.contains('active')) {
        listToUpdate = toDoList.filter(item => item.important === 'important');
    } else if (allNotImportantLists.classList.contains('active')) {
        listToUpdate = toDoList.filter(item => item.important === 'none');
    } else if (document.getElementById("search-list").value) {
        listToUpdate = toDoList.filter(item => 
            item.toDo.toLowerCase().includes(document.getElementById("search-list").value.toLowerCase()) ||
            item.dateAcomplish.toLowerCase().includes(document.getElementById("search-list").value.toLowerCase()) ||
            item.dateCreated.toLowerCase().includes(document.getElementById("search-list").value.toLowerCase())
        );
    }
   
   const currentList = listToUpdate[index];
   valueToEdit.value = currentList.toDo;
   dateToEdit.value = reverToConsiseCalendar(currentList.dateAcomplish);

   const saveButton = document.querySelector('.js-save-changes-btn');
   saveButton.replaceWith(saveButton.cloneNode(true)); 

   document.querySelector('.js-save-changes-btn').addEventListener('click', () =>{
      saveEditChanges(index);
   });


}


function saveEditChanges(index){
    const getEditValue = valueToEdit.value; 
    const getEditDate = dateToEdit.value;

    let listToUpdate = toDoList;
    if (allImportantLists.classList.contains('active')) {
        listToUpdate = toDoList.filter(item => item.important === 'important');
    } else if (allNotImportantLists.classList.contains('active')) {
        listToUpdate = toDoList.filter(item => item.important === 'none');
    } else if (document.getElementById("search-list").value) {
        listToUpdate = toDoList.filter(item => 
            item.toDo.toLowerCase().includes(document.getElementById("search-list").value.toLowerCase()) ||
            item.dateAcomplish.toLowerCase().includes(document.getElementById("search-list").value.toLowerCase()) ||
            item.dateCreated.toLowerCase().includes(document.getElementById("search-list").value.toLowerCase())
        );
    }

    const array = listToUpdate[index];
    array.toDo = getEditValue;
    array.dateAcomplish = dateAccomplish(getEditDate);
    array.dateCreated = dateCreated();

    if (allImportantLists.classList.contains('active'))
        filterImportantList();

    else if (allNotImportantLists.classList.contains('active'))
        filterNotImportantList();

    else if (document.getElementById("search-list").value.toLowerCase() !== 0)
        searchFilter();

    else
        addItems();

    document.querySelector('.edit-set-up-to-list').style.display = 'none';

}

//SHOW ALL LISTS

function showAllLists(){
    allLists.classList.add('active');
    allImportantLists.classList.remove('active');
    allNotImportantLists.classList.remove('active');

    addItems();
}

//FILTER IMPORTANT LIST
function filterImportantList(){
    allLists.classList.remove('active');
    allImportantLists.classList.add('active');
    allNotImportantLists.classList.remove('active');

    let filteredListImportant = toDoList.filter(item => item.important === 'important');
    filterRender(filteredListImportant);


}


//FILTER NOT IMPORTANT LIST
function filterNotImportantList(){
    allLists.classList.remove('active');
    allImportantLists.classList.remove('active');
    allNotImportantLists.classList.add('active');
    
    let filteredListNotImportant = toDoList.filter(item => item.important === 'none');
    filterRender(filteredListNotImportant);

}




// SEARCH FILTER FUNCTION
function searchFilter() {
    let searchInput = document.getElementById("search-list").value.toLowerCase();
    
    let filteredList = toDoList.filter(item => 
        item.toDo.toLowerCase().includes(searchInput) ||
        item.dateAcomplish.toLowerCase().includes(searchInput) ||
        item.dateCreated.toLowerCase().includes(searchInput)
    );

    filterRender(filteredList);

    document.querySelectorAll('.delete').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            toDoList = toDoList.filter(item => !filteredList.includes(item) || filteredList.indexOf(item) !== idx);
            searchFilter();
            localStorage.setItem('listMemory', JSON.stringify(toDoList));
        });
    });


    document.querySelectorAll('.edit').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            editList(toDoList.indexOf(filteredList[idx]));
        });
    });
}


function filterRender(filteredList){
    if (filteredList.length === 0) {
        check.innerHTML = '<p class="no-list">No items found</p>';
        return;
    }


    let filteredHTML = '';
    filteredList.forEach((toList, index) => {
        const html = `
            <div class="list ${toList.important}">
                <div class="list-contents">
                    <div class="to-to-and-date">
                        <p>${toList.toDo}</p>
                        <div class="item-date">${toList.dateAcomplish}</div>
                    </div>
                    <div class="edit-and-delete">
                        <button class="edit" onclick="editList(${index})">Edit</button>
                        <button class="delete" onclick="removeFromList(${index})">Delete</button>
                    </div>
                    <div class="created-at">
                        ${toList.dateCreated}
                    </div>
                </div>
            </div>`;
        filteredHTML += html;
    });

    document.querySelector('.js-listing').innerHTML = filteredHTML;

}

document.getElementById("search-list").addEventListener("input", searchFilter);













