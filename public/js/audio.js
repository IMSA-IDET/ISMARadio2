

document.getElementsByTagName("button")[0].addEventListener("click", e => {
    const socket = new WebSocket('ws://localhost:3001');
    socket.binaryType = "arraybuffer"

    socket.addEventListener('message', async (event) => {
        const inputData = buffer.getChannelData(0) || new Float32Array(this.bufferSize)
    });
})