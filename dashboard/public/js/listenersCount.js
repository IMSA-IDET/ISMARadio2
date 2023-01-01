const pointsCount = 300;

const chartCanvas = document.getElementById("listenerChart");
const chartContext = listenerChart.getContext("2d");

chartContext.strokeStyle = "#3a60de";
chartContext.lineWidth = 3;

let dataArray = [];
let dataMax = 1;

const updateListenerData = newCount => {
    if (dataArray.length == pointsCount) {
        dataArray.shift();
    }
    
    dataArray.push(newCount);
}

const drawChart = () => {
    chartContext.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    const newMax = Math.max(...dataArray);
    if (dataMax < newMax) {
        dataMax = newMax;
        document.getElementById("chartMax").innerHTML = dataMax;
    }

    chartContext.strokeStyle = "#3a60de";
    chartContext.beginPath();
    for (let i = dataArray.length - 1; i >= 0; i--) {
        const x = 30 + (i / dataArray.length) * (chartCanvas.width - 40);
        const height = 10 + (dataArray[i] / dataMax) * (chartCanvas.height - 25);
        chartContext.lineTo(x, chartCanvas.height - height);
    }
    chartContext.stroke();

    chartContext.strokeStyle = "#000";
    chartContext.beginPath();
    chartContext.moveTo(30, 10);
    chartContext.lineTo(30, chartCanvas.height - 10);
    chartContext.lineTo(chartCanvas.width - 10, chartCanvas.height - 10);
    chartContext.stroke();
}

const listenersMessage = count => {
    document.getElementById("listenerCounter").innerHTML = `${count} Listeners`;
    updateListenerData(count);
}

setInterval(() => {
    drawChart();
    updateListenerData(dataArray[dataArray.length - 1]);
}, 40);