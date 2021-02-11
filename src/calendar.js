import "bootstrap";
import "./styles/calendar/main.css";
import "./styles/calendar/main.scss";
import "./styles/main.scss";
import {
    getAllEvents, 
    users, 
    time, 
    days, 
    createCalendarWithEvent, 
    getUserById,
    openDropdown
} from "./main.js";

const createUsersSelector = (usersList = users) => {
    let createListUsers = document.createElement("ul");
    createListUsers.className ="dropdown-content simple-dropdown";
    createListUsers.id = "dropdown-user-list";
    let getDropdown = document.getElementById("dropdown");
    getDropdown.appendChild(createListUsers);
    
    usersList.forEach(user => {
        let createItem = document.createElement("li");
        createItem.className = "list";
        createItem.id = user.id;
        createItem.innerText = `${user.name}`;
        createListUsers.appendChild(createItem);
    });
}

const obtainDropdownValue = (item) => {
    let dropdownValue = document.getElementById("dropdown-value");
    dropdownValue.textContent = item.textContent;
    createCalendar(time, days, item.id);
}

const createUserDropdownEvents = () => {
    document.getElementById("btn-dropdown").addEventListener("click", () => openDropdown("dropdown-user-list"));
    let dropDowns = document.querySelectorAll(".list"); 
    dropDowns.forEach(element => {
        element.addEventListener("click", (e) => obtainDropdownValue(e.target));
    });
}

const removeEventByDayTimeId = (eventId) => {
    if (eventId && eventId.includes("_")) {
        const allEvents = getAllEvents();
        const dayTimeIds = eventId.split("_");
        const day = dayTimeIds[0];
        const time = dayTimeIds[1];
        const eventDay = allEvents[day];
        delete eventDay[time];
        if (Object.keys(eventDay).length === 0) {
            delete allEvents[day];
        }
        localStorage.setItem("events", JSON.stringify(allEvents));
        window.location = "/";
    }
}

const createModal = (deleteId) => {
    let modal = document.getElementById(`modal_${deleteId}`);
    if (!modal) {
        modal = document.createElement("div");
        modal.id = `modal_${deleteId}`;
        modal.className = "modal";
    }
    return modal;
}

const modalFunction = (modal, btnModal, closeButton) => {
    btnModal.onclick = function () {
       modal.style.display = "block";
    }
   
    closeButton.onclick = function () {
       modal.style.display = "none";
    }
}

const createDeleteBlock = (deleteId, eventName) => {
    let modalContent = createModal(deleteId);
    let deleteBtnId = `yes-delete-btn_${deleteId}`;
    let cancelBtnId = `no-delete-btn_${deleteId}`;

    modalContent.innerHTML = `
        <div class="delete-modal">
            <p class="massage-delete">
                Are you sure you want to delete "${eventName}" event?
            </p>
            <div>
                <a class="btn button" id=${cancelBtnId} style="background-color: #ffffff;" href="#" role="button">No</a>
                <a class="btn button" id=${deleteBtnId} style="background-color: #ffffff;" href="#" role="button">Yes</a>
            </div>
        </div>
    `;

    document.getElementById("wrapper").appendChild(modalContent);

    modalFunction(modalContent, document.getElementById(deleteId), document.getElementById(cancelBtnId));
    document.getElementById(deleteBtnId).addEventListener("click", () => removeEventByDayTimeId(deleteId));
}

const createCalendar = (timeOfDay = time, daysOfWeek = days, userId = "") => {
    let calendarWithEvents = createCalendarWithEvent(userId);
    let userById = userId ? getUserById(userId) : null;
    let name = userById ? userById.name : "All";
    console.log(calendarWithEvents);
    let getCalendar = document.getElementById("calendar");
    getCalendar.textContent = "";
    let rowHeader = document.createElement("div");
    rowHeader.className = "row";
    let nameCol = document.createElement("div");
    nameCol.className = "col p-3 cell item";
    nameCol.innerText = name;
    rowHeader.appendChild(nameCol);
    getCalendar.appendChild(rowHeader);  

    let daysArr = Object.keys(daysOfWeek);

    daysArr.forEach(day => {
        let dayCol = document.createElement("div");
        dayCol.className = "col p-3 cell item";
        dayCol.innerText = day;
        rowHeader.appendChild(dayCol);
    })  
    
    Object.keys(timeOfDay).forEach(time => {
        let rowMain = document.createElement("div");
        rowMain.className = "row";
        getCalendar.appendChild(rowMain);

        let timeCol = document.createElement("div");
        timeCol.className = "col p-3 cell";
        timeCol.innerText = time;
        rowMain.appendChild(timeCol);

        Object.values(calendarWithEvents).forEach(day => {
            let descriptionCol = document.createElement("div");
            descriptionCol.className = "col p-3 cell";
            descriptionCol.innerHTML = "";
            let daysTime = day[time];
            rowMain.appendChild(descriptionCol);
            if (Object.entries(daysTime).length !== 0) {
                let deleteId = `${daysTime.day}_${daysTime.time}`; 
                descriptionCol.classList.toggle("description-cell");
                descriptionCol.innerHTML = `
                    ${daysTime.description}
                    <div id="${deleteId}" class="icon-delete">
                        <img src="assets/icons/icon-delete.png" alt="delete">
                    </div>
                `;
                createDeleteBlock(deleteId, daysTime.description);
            }
        })  
    }) 
}

createUsersSelector();
createUserDropdownEvents();
createCalendar();