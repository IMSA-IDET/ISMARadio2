const playBtn = document.getElementsByTagName("button")[0];
let playClicked = false;

playBtn.addEventListener("click", _ => {
    if (!playClicked) {
        playClicked = true;

        // TODO: do some button effects/animations/style changes
        playBtn.innerHTML = "clicked";

        // TODO: initiate audio visualization

        const context = new (window.AudioContext || window.webkitAudioContext)();
        const socket = new WebSocket("ws://localhost:3001");

        socket.addEventListener("message", async event => {
            let socketBuffer = await event.data.arrayBuffer();
            socketBuffer = new Int16Array(socketBuffer);

            const audioBuffer = context.createBuffer(
                1,
                44100 * 2,
                44100
            );

            for (let i = 0; i < audioBuffer.length; i++) {
                audioBuffer.getChannelData(0)[i] = socketBuffer[i] / 32767;
            }

            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);
            source.start();
        });
    }
})