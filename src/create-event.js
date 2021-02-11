import "bootstrap";
import "./styles/create-event/main.css";
import "./styles/create-event/main.scss";
import "./styles/main.scss";
import {
    time, 
    days, 
    users, 
    openDropdown, 
    getAllEvents
} from "./main.js";

const createSelectorForSingleValue = (dataList, dropdownListId, createList) => {
    dataList.forEach(data => {
        let createItem = document.createElement("li");
        createItem.className = `list ${dropdownListId}`;
        createItem.id = data;
        createItem.innerText = `${data}`;
        createList.appendChild(createItem);
    });
}

const createSelectorForMultiValue = (dataList, dropdownListId, createList, listClass) => {
    dataList.forEach(data => {
        let createItem = document.createElement("li");
        createItem.className = `list ${dropdownListId}`;
        if (data.id) {
            createItem.id = data.id;
            createItem.innerHTML = `
                <input type="checkbox" id="${data.id}" class="${listClass}" value="${data.name}">
                <label class="${listClass}" for="${data.id}">${data.name}</label>
            `
        }
        createList.appendChild(createItem);
    });
}

const createDataSelector = (dataList, dropdownListId, dropdownId, listClass, selectorCreator) => {
    let createList = document.createElement("ul");
    createList.className =`dropdown-content ${listClass}`;
    createList.id = dropdownListId;
    let getDropdown = document.getElementById(dropdownId);
    getDropdown.appendChild(createList);

    selectorCreator(dataList, dropdownListId, createList, listClass);
}

const createSingleDataSelector = (dataList, dropdownListId, dropdownId) => {
    createDataSelector(dataList, dropdownListId, dropdownId, "simple-dropdown", createSelectorForSingleValue);
}

const createMultiValueDataSelector = (dataList, dropdownListId, dropdownId) => {
    createDataSelector(dataList, dropdownListId, dropdownId, "multi-dropdown", createSelectorForMultiValue);
}

const concatContentIfPresent = (content, separator, concatValue) => {
    return content ? content + separator + concatValue : concatValue;
}

const removeContent = (content, separator, value) => {
    return content.split(separator).filter(element => element !== value).join(separator);
}

const obtainDropdownValue = (item, dropdownValueId) => {
    let dropdownValue = document.getElementById(dropdownValueId);
    dropdownValue.textContent = item.textContent;
    dropdownValue.setAttribute("data-value", item.id);
}

const obtainMultiDropdownValue = (item, dropdownValueId) => {
    if (item.checked) {
        let dropdownValue = document.getElementById(dropdownValueId);
        let dropdownTextContent = concatContentIfPresent(dropdownValue.textContent, ", ", item.value);
        let dropDownDataValue = concatContentIfPresent(dropdownValue.dataset.value, ",", item.id);    
        dropdownValue.textContent = dropdownTextContent;
        dropdownValue.setAttribute("data-value", dropDownDataValue);
    } else {
        let dropdownValue = document.getElementById(dropdownValueId);
        let dropdownTextContent = removeContent(dropdownValue.textContent, ", ", item.value);
        let dropDownDataValue = removeContent(dropdownValue.dataset.value, ",", item.id);    
        dropdownValue.textContent = dropdownTextContent;
        dropdownValue.setAttribute("data-value", dropDownDataValue);
    }
}

const createDropdownEvents = (id, dropdownListId, dropdownValueId) => {
    document.getElementById(id).addEventListener("click", () => {openDropdown(dropdownListId)});
    let dropDowns = document.querySelectorAll(`.${dropdownListId}`); 
    dropDowns.forEach(element => {
        element.addEventListener("click", (e) => obtainDropdownValue(e.target, dropdownValueId));
    });
}
 
const createMultiValueDropdownEvents = (id, dropdownListId, dropdownValueId) => {
    document.getElementById(id).addEventListener("click", () => {openDropdown(dropdownListId)});
    let dropDowns = document.querySelectorAll(`.${dropdownListId}`); 
    dropDowns.forEach(element => {
        element.addEventListener("click", (e) => obtainMultiDropdownValue(e.target, dropdownValueId));
    });
}

const isValidNewEvent = (user, day, time, allEvents) => {
    if (!user || !day || !time) {
        return false;
    } else if (allEvents[day]) {
        let newDay = allEvents[day];
        if (newDay[time]) {
            return false;
        }
    }
    return true;
}

const createEvent = () => {
    const nameEvent = document.getElementById("event-name").value;
    const user = document.getElementById("dropdown-value-user").dataset.value;
    const day = document.getElementById("dropdown-value-day").dataset.value;
    const time = document.getElementById("dropdown-value-time").dataset.value;
    const allEvents = getAllEvents();
    if (!isValidNewEvent(users, day, time, allEvents)) {
        document.getElementById("error").classList = "error show-error";
        return;
    }
    const allEventsOfDay = getElementByKeyOrCreate(allEvents, day);
    const eventOfHour = {
        "id": new Date().getTime(),
        "description": nameEvent,
        "time": time,
        "day": day,
        "userId": user
    };
    allEventsOfDay[time] = eventOfHour;
    allEvents[day] = allEventsOfDay;
    localStorage.setItem("events", JSON.stringify(allEvents));
    window.location.replace("/");
}

const getElementByKeyOrCreate = (elements, key) => {
    return elements[key] ? elements[key] : {};
}

const closeError =  () => {
    document.getElementById("error").classList = "error";
}

createMultiValueDataSelector(users, "dropdown-user-list", "dropdown-user")
createSingleDataSelector(Object.keys(days), "dropdown-day-list", "dropdown-day");
createSingleDataSelector(Object.keys(time), "dropdown-time-list", "dropdown-time");
createMultiValueDropdownEvents("btn-dropdown-user", "dropdown-user-list", "dropdown-value-user");
createDropdownEvents("btn-dropdown-day", "dropdown-day-list", "dropdown-value-day");
createDropdownEvents("btn-dropdown-time", "dropdown-time-list", "dropdown-value-time");

document.getElementById("btn-create").addEventListener("click", () => createEvent());
document.getElementById("icon-close").addEventListener("click", () => closeError());