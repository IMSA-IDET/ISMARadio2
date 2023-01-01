// Config
const bufferSize = 44100;
const bufferVisualRate = 48; // 4 bars per buffer
const barCount = bufferVisualRate;

const canvas = document.getElementById("visualCanvas");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "#3a60de";
ctx.lineWidth = 100 / barCount;

let barArray = [];

const bufferToArray = (buffer, start) => {
    if (barArray.length == barCount) {
        barArray.shift();
    }
    const newBuffer = buffer.slice(start, start + buffer.length / bufferVisualRate);
    barArray.push(Math.max(...newBuffer));
}

const drawBars = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = barArray.length - 1; i >= 0; i--) {
        ctx.beginPath();
        const x = i * (canvas.width / barCount);
        const height = barArray[i] * 46;
        ctx.moveTo(x, 50 - height - 2);
        ctx.lineTo(x, 50 + height + 2);
        ctx.stroke();
    }
}

const audioMessage = async data => {
    let socketBuffer = await data.arrayBuffer();
    socketBuffer = new Int32Array(socketBuffer);

    let visualBuffer = new Float32Array(socketBuffer.length);

    for (let i = 0; i < visualBuffer.length; i++) {
        visualBuffer[i] = socketBuffer[i] / 2147483647; // 2^32 / 2 -1
    }

    for (let i = 0; i < bufferVisualRate; i++) {
        const start = i * (visualBuffer.length / bufferVisualRate);
        setTimeout(() => {
            bufferToArray(visualBuffer, start);
            drawBars();
        }, (start / 44100) * 1000);
    }
}