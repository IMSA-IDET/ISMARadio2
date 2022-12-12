// Config
const serverURL = "ws://localhost:3001";

const playBtn = document.getElementsByTagName("button")[0]//document.getElementById("playButton");
let playClicked = false;

let context = new (window.AudioContext || window.webkitAudioContext)();
let socket = new WebSocket(serverURL);

let volume = 1;

playBtn.addEventListener("click", _ => {
    if (!playClicked) {
        playClicked = true;

        // TODO: do some button effects/animations/style changes
        playBtn.innerHTML = "pause";

        socket.addEventListener("message", async event => {
            let socketBuffer = await event.data.arrayBuffer();
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

            // TODO: send socketBuffer array to canvas audio visual

            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);
            source.start();
        });
    } else {
        playClicked = false;

        context = null;
        socket = null;

        // TODO: do some button effects/animations/style changes
        playBtn.innerHTML = "play";
    }
})