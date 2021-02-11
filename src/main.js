let idUser = 0;
export const users = [
    {
        "id": ++idUser,
        "name": "Masha"     
    },
    {
        "id": ++idUser,
        "name": "Pasha"     
    },
    {
        "id": ++idUser,
        "name": "Dasha"     
    },
];

export const getUserById = (userId) => {
    return users.find(user => user.id === Number(userId));
}

let createTimes = () => {
    return {"10:00":{}, "11:00":{}, "12:00":{}, "13:00":{}, "14:00":{}, "15:00":{}, "16:00":{}, "17:00":{}, "18:00":{}};
}

let createDays = () => {
    return {"Mon": createTimes(), "Tue": createTimes(), "Wen": createTimes(), "Thu": createTimes(), "Fri": createTimes()};
}

export const time = createTimes();
export const days = createDays();

export const getAllEvents = () => {
    let eventsFromLS = localStorage.getItem("events");
    return eventsFromLS ? JSON.parse(eventsFromLS) : {};
}

const mergeCalendarDayWithEventDay = (eventDay, calendarDay, userId) => {
    Object.keys(eventDay).forEach(time => {
        let eventTime = eventDay[time];
        if (eventTime && (userId === "" || eventTime.userId.includes(userId))) {
            calendarDay[time] = eventTime;
        }
    })
}

export const createCalendarWithEvent = (userId) => {
    let dayResults = createDays();
    let events = getAllEvents();

    Object.keys(events).forEach(day => {
        let eventDay = events[day];
        let calendarDay = dayResults[day];
        if (eventDay && calendarDay) {
            mergeCalendarDayWithEventDay(eventDay, calendarDay, userId);
        }
    })
    return dayResults;
}

export const openDropdown = (id) => {
    document.getElementById(id).classList.toggle("show");
}

const checkTargetClasses = (classes = [], eventTarget) => {
    for (let i = 0; i < classes.length; i++) {
        let currentClass = classes[i];
        if (eventTarget.matches(currentClass)) {
            return true;
        }
    }
    return false;
}

window.onclick = function(event) {
    let eventTarget = event.target;  
    if (!checkTargetClasses([".btn-dropdown", ".triangle-down", ".multi-dropdown"], eventTarget)) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let dropdown = dropdowns[i];
            if (dropdown.classList.contains("show")) {
                dropdown.classList.remove("show");
            }
        }
    }
}