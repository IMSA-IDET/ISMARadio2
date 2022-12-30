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

fetch("/scheduleData").then(data => data.json()).then(json => infoHandler(json));
const infoMessage = data => infoHandler(data);



const timeText = document.getElementById("streamStart");

setInterval(() => {
    timeText.innerHTML = numberToTimer(Date.now() - timeSinceStart);
}, 1000)