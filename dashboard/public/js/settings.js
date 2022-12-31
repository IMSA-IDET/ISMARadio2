const currentShow = document.getElementById("currentShow");
const settingsIDs = ["HostSet", "PortSet", "PasswordSet", "MicrophoneSet", "RecordingSet", "VolumeSet"];


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

const applySettings = () => {
    settingsIDs.forEach(id => {
        const settingValue = document.getElementById(id).value;

        if (settingValue != "") {
            localStorage.setItem(id, settingValue);
        }
    });

    fetch(GetServerURL() + "/checkPassword", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: localStorage.getItem("PasswordSet")
        })
    }).then(data => data.json()).then(json => {
        if (!json) {
            setCurrentShowText("[Incorrect Password]");
        } else {
            setCurrentShowText("[Connected]");
        }
    }).catch(err => {
        console.log(err);
    });
}