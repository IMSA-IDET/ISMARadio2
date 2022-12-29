const playBtn = document.getElementById("playButton");
const playBtnImage = document.getElementById("playButtonImage");
const pauseBtnImage = document.getElementById("pauseButtonImage");

let playClicked = false;
let context = null;
let volume = 1;

playBtn.addEventListener("click", () => {
    if (!playClicked) {
        playClicked = true;

        context = new (window.AudioContext || window.webkitAudioContext)();

        playBtnImage.style.display = "none";
        pauseBtnImage.style.display = "block";
    } else {
        playClicked = false;

        playBtnImage.style.display = "block";
        pauseBtnImage.style.display = "none";
    }
})

const audioMessage = async data => {
    console.log(data)
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
    }
}