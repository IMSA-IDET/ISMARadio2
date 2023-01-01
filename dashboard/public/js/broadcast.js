const electron = require("electron");
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const startPauseBroadcast = document.getElementById("startPauseBroadcast");
const broadcastStatus = document.getElementById("broadcastStatus");

let castStarted = false;
let connected = false;

let startTime;
let timerInterval;

const startBroadcast = () => {
    if (!castStarted) {
        startPauseBroadcast.innerHTML = "Pause";
        castStarted = true;

        if (!connected) {
            broadcastStatus.innerHTML = "Recording starting...";
            broadcastStatus.style.color = "orange";

            ipc.send("startRecording", {
                socketURL: GetSocketURL(),
                microphoneID: localStorage.getItem("MicrophoneSet"),
                recordingName: localStorage.getItem("RecordingSet"),
                volumeMultiplier: localStorage.getItem("VolumeSet")
            });

            let hasError = false;
            ipc.on("recordingStatus", (event, status) => {
                switch(status) {
                    case "connected":
                        if (!hasError) {
                            broadcastStatus.innerHTML = "Connected";
                            broadcastStatus.style.color = "green";
                            connected = true;

                            startTime = Date.now();

                            timerInterval = setInterval(() => {
                                updateTimeAlive();
                                updateTimeUntilEnd();
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
    } else {
        startPauseBroadcast.innerHTML = "Continue";

        broadcastStatus.innerHTML = broadcastStatus.innerHTML + " [Paused]";

        ipc.send("muteMic");
    }
}

const stopBroadcast = () => {
    if (castStarted) {
        startPauseBroadcast.innerHTML = "Start";
        castStarted = false;

        ipc.send("stopRecording");
        ipc.send("unmuteMic");

        ipc.on("stoppedRecording", (event, status) => {
            connected = false;
            hasError = false;

            broadcastStatus.innerHTML = "Stopped";
            broadcastStatus.style.color = "red";

            clearInterval(timerInterval);
        });
    }
}



const updateTimeAlive = () => {

}

const updateTimeUntilEnd = () => {
    
}