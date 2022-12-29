let timeSinceStart = Date.now();

const infoHandler = info => {
    timeSinceStart = info.streamStart;
    
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

    const nextContainer = document.getElementById("nextContainer");
    nextContainer.textContent = "";
    info.next.forEach(next => {
        if (next.rank == 999) {
            return;
        }
        
        const nextItem = document.createElement("div");
        nextItem.classList.add("nextItem");

        const nextTimeSlot = document.createElement("h5");
        nextTimeSlot.classList.add("nextTimeSlot");
        const time = next.show.schedule;
        nextTimeSlot.innerHTML = `<b>${numberToDay(time.day)}</b>&nbsp;&nbsp;${numberToTime(time.start)} - ${numberToTime(time.end)}`;
        nextItem.append(nextTimeSlot);

        const nextName = document.createElement("h4");
        nextName.classList.add("upnextName");
        nextName.innerHTML = next.show.name;
        nextItem.append(nextName);

        const nextCover = document.createElement("img");
        nextCover.classList.add("upnextcover");
        nextCover.src = next.show.cover;
        nextItem.append(nextCover);

        nextContainer.append(nextItem);
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



const numberToTimer = n => {
    const addZero = t => (t < 10) ? `0${t}` : t;

    let hour = Math.floor(n / 1000 / 60 / 60);
    hour = addZero(hour);

    let minute = Math.floor((n / 1000 / 60) - hour * 60);
    minute = addZero(minute);

    let second = Math.floor((n / 1000) - hour * 60 * 60 - minute * 60);
    second = addZero(second);

    return `${hour}:${minute}:${second}`;
}

const timeText = document.getElementById("streamStart");

setInterval(() => {
    timeText.innerHTML = numberToTimer(Date.now() - timeSinceStart);
}, 1000)