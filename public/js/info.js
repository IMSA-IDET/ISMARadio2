const infoHandler = info => {
    const current = info.current;
    document.getElementById("currentName").innerHTML = current.name;
    document.getElementById("albumcover").src = current.cover;
    document.getElementById("description").getElementsByTagName("p")[0].innerHTML = current.description;
    
    const scheduleContainer = document.getElementById("Schedule").getElementsByTagName("div")[0];
    scheduleContainer.textContent = "";
    current.schedule.forEach(time => {
        const date = document.createElement("h5");
        date.classList.add("showScheduleTime");
        date.innerHTML = `<b>${numberToDay(time.day)}</b>&nbsp;&nbsp;${numberToTime(time.start)} - ${numberToTime(time.end)}`;
        scheduleContainer.append(date);
    });

    info.next.forEach(next => {
        if (next.rank == 999) {
            return
        }
        
        const date = document.createElement("h5");
    });
}

const numberToDay = n => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[n];
}

const numberToTime = n => {
    let hour = Math.round(n);

    let minute = Math.round((n - hour) * 60);
    minute = (minute < 10) ? `0${minute}` : minute;

    let meridiem = (hour <= 12) ? "AM" : "PM";

    return `${hour % 12}:${minute} ${meridiem}`;
}

fetch("/schedule").then(data => data.json()).then(json => infoHandler(json));
const infoMessage = data => infoHandler(data);