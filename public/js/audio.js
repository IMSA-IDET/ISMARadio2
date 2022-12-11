const playBtn = document.getElementsByTagName("button")[0];
let playClicked = false;

playBtn.addEventListener("click", _ => {
    if (!playClicked) {
        playClicked = true;

        // TODO: do some button effects/animations/style changes
        playBtn.innerHTML = "clicked";

        // TODO: initiate audio visualization

        const context = new (window.AudioContext || window.webkitAudioContext)();
        const socket = new WebSocket("ws://143.195.43.164:3001");

        socket.addEventListener("message", async event => {
            let socketBuffer = await event.data.arrayBuffer();
            socketBuffer = new Int32Array(socketBuffer);

            const audioBuffer = context.createBuffer(
                1,
                44100,
                44100
            );

            for (let i = 0; i < audioBuffer.length; i++) {
                audioBuffer.getChannelData(0)[i] = socketBuffer[i] / 2147483647//4294967295; // 2^32 / 2 -1
            }

            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);
            source.start();
        });
    }
})