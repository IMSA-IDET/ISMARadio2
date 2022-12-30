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