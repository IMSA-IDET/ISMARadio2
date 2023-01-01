const dataCounter = document.getElementById("dataCounter");

let totalData = 0; // In bytes
let pingStart;

const pingServer = () => {
    if (server.readyState == 1) {
        pingStart = Date.now();
    
        server.send(JSON.stringify({
            "route": "ping"
        }));
    }
}

setTimeout(() => pingServer(), 1000); // 1s connecting threshold
setInterval(() => pingServer(), 5000);

const pongMessage = () => {
    document.getElementById("serverPing").innerHTML = `Ping: ${Date.now() - pingStart}ms`;
}