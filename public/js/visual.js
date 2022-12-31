// Config
const bufferSize = 44100;
const bufferVisualRate = 32; // 4 bars per buffer
const barCount = bufferVisualRate * 2;

const canvas = document.getElementById("visualCanvas");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "#3a60de";
ctx.lineWidth = 200 / barCount;

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