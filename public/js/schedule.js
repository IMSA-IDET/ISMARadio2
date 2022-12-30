fetch("/showsData").then(data => data.json()).then(json => {
    json.forEach(show => {
        const showContainer = document.createElement("div");
        showContainer.classList.add("showContainer");
        showContainer.innerHTML = `
            <h4>${show.name}</h4>
            <img src="${show.cover}">
            <div class="showScheduleContainer"></div>
            <p>${show.description}</p>
        `;
        document.getElementById("showsContainer").appendChild(showContainer);

        const showScheduleContainer = showContainer.getElementsByClassName("showScheduleContainer")[0];
        show.schedule.forEach(time => {
            const scheduleItem = document.createElement("h5");
            scheduleItem.innerHTML = `<b>${numberToDay(time.day)}</b>&nbsp;&nbsp;${numberToTime(time.start)} - ${numberToTime(time.end)}`;
            showScheduleContainer.appendChild(scheduleItem);
        });
    });
});