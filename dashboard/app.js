const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const { mic } = require('win-audio');

let win;
let child;

const killAudioChild = () => {
    return new Promise((resolve, reject) => {
        const taskKiller = spawn("taskkill", ["/im", "audio.exe", "/f", "/t"]);

        taskKiller.stdout.on("data", data => {
            resolve(true)
        });

        taskKiller.stderr.on("data", data => {
            resolve(true);
        });
    });
}
killAudioChild();

const createWindow = () => {
    win = new BrowserWindow({
        width: 700,
        height: 700,
        autoHideMenuBar: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile("public/broadcast.html");
}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});


ipcMain.on("startRecording", (event, arg) => {
    child = spawn("audio\\bin\\Debug\\net6.0-windows\\audio.exe", [
        arg.socketURL,
        arg.microphoneID,
        arg.recordingName
    ], { shell: true });

    child.stdout.on("data", data => {
        console.log(`stdout: ${data}`);

        let connected = false;
        switch ((data + "").replace("\r\n", "")) {
            case "Recording started":
                win.webContents.send("recordingStatus", "recordingStarted");
                setTimeout(() => {
                    if (connected) {
                        win.webContents.send("recordingStatus", "noServer");
                    }
                }, 1000);
                break;
            case "Reconnection type: Initial":
                connected = true;
                win.webContents.send("recordingStatus", "connected");
                break;
        }
    });

    child.stderr.on("data", data => {
        console.error(`stderr: ${data}`);

        win.webContents.send("recordingStatus", "unknown");
    });

    child.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });
});

ipcMain.on("stopRecording", (event, arg) => {
    killAudioChild().then(result => {
        win.webContents.send("stoppedRecording");
    });
});

ipcMain.on("muteMic", (event, arg) => {
    mic.mute();
});

ipcMain.on("unmuteMic", (event, arg) => {
    mic.unmute();
});