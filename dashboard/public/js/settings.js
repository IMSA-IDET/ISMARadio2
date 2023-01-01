const currentShow = document.getElementById("currentShow");
const settingsIDs = ["HostSet", "PortSet", "PasswordSet", "MicrophoneSet", "RecordingSet"];


settingsIDs.forEach(id => {
    const settingInput = document.getElementById(id);

    settingInput.value = localStorage.getItem(id);
});

const setCurrentShowText = msg => {
    fetch(GetServerURL() + "/scheduleData").then(data => data.json()).then(json => {
        currentShow.innerHTML = `Current Show: ${json.current.name} ${msg}`;
    }).catch(err => {
        console.log(err);
        currentShow.innerHTML = "Cannot connect to server";
    });
}
setCurrentShowText("");

const applySettings = async () => {
    settingsIDs.forEach(id => {
        const settingValue = document.getElementById(id).value;

        if (settingValue != "") {
            localStorage.setItem(id, settingValue);
        }
    });

    if (!await CheckPassword()) {
        setCurrentShowText("[Incorrect Password]");
    } else {
        setCurrentShowText("[Connected]");
    }
}