const playBtn = document.getElementById("playButton");
const playBtnImage = document.getElementById("playButtonImage");
const pauseBtnImage = document.getElementById("pauseButtonImage");
const streamStatus = document.getElementById("streamStatus");
const streamStart = document.getElementById("streamStart");

let playClicked = false;
let context = null;
let volume = 1;
let lastBufferTimestamp = Date.now();

playBtn.addEventListener("click", () => {
    if (!playClicked) {
        playClicked = true;

        context = new (window.AudioContext || window.webkitAudioContext)();

        playBtnImage.style.display = "none";
        pauseBtnImage.style.display = "block";

        streamStatus.innerHTML = "";
        streamStart.style.display = "block";

        lastBufferTimestamp = Date.now();
        setTimeout(() => checkIfLive(), 1500);
    } else {
        playClicked = false;

        playBtnImage.style.display = "block";
        pauseBtnImage.style.display = "none";
    }
})

const audioMessage = async data => {
    if (playClicked) {
        let socketBuffer = await data.arrayBuffer();
        socketBuffer = new Int32Array(socketBuffer);

        let visualBuffer = new Float32Array(socketBuffer.length);

        const audioBuffer = context.createBuffer(
            1,
            44100,
            44100
        );

        for (let i = 0; i < audioBuffer.length; i++) {
            visualBuffer[i] = socketBuffer[i] / 2147483647; // 2^32 / 2 -1
            audioBuffer.getChannelData(0)[i] = visualBuffer[i] * volume;
        }

        for (let i = 0; i < bufferVisualRate; i++) {
            const start = i * (visualBuffer.length / bufferVisualRate);
            setTimeout(() => {
                bufferToArray(visualBuffer, start);
                drawBars();
            }, (start / 44100) * 1000);
        }

        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        source.start();

        lastBufferTimestamp = Date.now();
        checkIfLive();
        setTimeout(() => checkIfLive(), 1500);
    }
}

const checkIfLive = () => {
    // Max timeout: 500ms
    // Overhead: 200ms
    if (playClicked) {
        if (Date.now() - lastBufferTimestamp > 1000) {
            streamStatus.style.color = "red";
            streamStatus.innerHTML = "Radio stream offline";
            streamStart.style.display = "none";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            streamStatus.innerHTML = "";
            streamStart.style.display = "block";
        }
    }
}