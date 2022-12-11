


console.log(document.getElementsByTagName("button")[0])
document.getElementsByTagName("button")[0].addEventListener("click", e => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:3001');

    // Connection opened
    socket.addEventListener('open', (event) => {
        console.log("opene")
    });

    // Listen for messages
    socket.addEventListener('message', async (event) => {
        console.log(event.data)

        let test = await event.data.arrayBuffer()
        test = new Int16Array(test)
        console.log(Math.max(...test))
        
        const myArrayBuffer = audioCtx.createBuffer(
            1,
            44100 * 2,
            44100
        );

        for (let i = 0; i < myArrayBuffer.length; i++) {
            myArrayBuffer.getChannelData(0)[i] =  test[i] / 32767
        }


        const source = audioCtx.createBufferSource();
        source.buffer = myArrayBuffer;
        source.connect(audioCtx.destination);
        source.start();
    });
})



