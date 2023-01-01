const electron = require("electron");
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const startPauseBroadcast = document.getElementById("startPauseBroadcast");
const broadcastStatus = document.getElementById("broadcastStatus");

let castPlayed = false;
let connected = false;

let startTime;
let endTime;
let timerInterval;

const startBroadcast = async () => {
    if (!castPlayed) {
        if (!connected) {
            if (!await CheckPassword()) {
                broadcastStatus.innerHTML = "Incorrect password";
                broadcastStatus.style.color = "red";
                return;
            }

            broadcastStatus.innerHTML = "Recording starting...";
            broadcastStatus.style.color = "orange";

            ipc.send("startRecording", {
                socketURL: GetSocketURL(true),
                microphoneID: localStorage.getItem("MicrophoneSet"),
                recordingName: localStorage.getItem("RecordingSet"),
                volumeMultiplier: localStorage.getItem("VolumeSet")
            });

            let hasError = false;
            ipc.on("recordingStatus", async (event, status) => {
                switch(status) {
                    case "connected":
                        if (!hasError) {
                            broadcastStatus.innerHTML = "Connected";
                            broadcastStatus.style.color = "green";
                            connected = true;

                            startTime = Date.now();

                            scheduleData = await fetch(GetServerURL() + "/scheduleData");
                            scheduleJSON = await scheduleData.json();
                            endTime = scheduleJSON.streamEnd;

                            if (timerInterval != undefined) {
                                clearInterval(timerInterval);
                            }

                            timerInterval = setInterval(() => {
                                updateOnlineCounter();
                                updateEndCounter();
                            }, 1000);
                        }
                        break;
                    case "disconnected":
                        broadcastStatus.innerHTML = "Disconnected";
                        broadcastStatus.style.color = "red";
                        break;
                    case "noServer":
                        broadcastStatus.innerHTML = "Can't connect";
                        broadcastStatus.style.color = "red";
                        break;
                    case "unknown":
                        broadcastStatus.innerHTML = "Unknown error";
                        broadcastStatus.style.color = "red";
                        hasError = true;
                        break;
                }
            });
        } else {
            broadcastStatus.innerHTML = broadcastStatus.innerHTML.replace(" [Paused]", "");

            ipc.send("unmuteMic");
        }
        
        startPauseBroadcast.innerHTML = "Pause";
        castPlayed = true;
    } else {
        castPlayed = false;

        startPauseBroadcast.innerHTML = "Continue";

        broadcastStatus.innerHTML = broadcastStatus.innerHTML + " [Paused]";

        ipc.send("muteMic");
    }
}

const stopBroadcast = () => {
    if (castPlayed) {
        startPauseBroadcast.innerHTML = "Start";
        castPlayed = false;

        ipc.send("stopRecording");
        ipc.send("unmuteMic");

        ipc.on("stoppedRecording", (event, status) => {
            connected = false;
            hasError = false;

            broadcastStatus.innerHTML = "Stopped";
            broadcastStatus.style.color = "red";

            totalData = 0;
            dataCounter.innerHTML = "Data sent: 0mb";

            document.getElementById("onlineCounter").innerHTML = "Online: 00:00:00";
            document.getElementById("endCounter").innerHTML = "Until end: 00:00:00";
            clearInterval(timerInterval);
        });
    }
}



const updateOnlineCounter = () => {
    document.getElementById("onlineCounter").innerHTML = `Online: ${numberToTimer(Date.now() - startTime)}`;
}

const updateEndCounter = () => {
    document.getElementById("endCounter").innerHTML = `Until end: ${numberToTimer(endTime - Date.now())}`;
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

const checkBroadcastStatus = href => {
    if (connected) {
        alert("Stop broadcast before changing settings");
    } else {
        location.href = href;
    }
}