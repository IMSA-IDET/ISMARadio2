const serverURL = GetSocketURL(false);

let server = new WebSocket(serverURL);

server.addEventListener("error", event => {
    broadcastStatus.innerHTML = "Server offline";
    broadcastStatus.style.color = "red";
});

server.addEventListener("message", event => {
    try {
        const json = JSON.parse(event.data);

        switch(json.route) {
            case "listeners":
                //listenersMessage(json.data);
                break;
            case "ping":
                pongMessage();
                break;
        }
    } catch(_) {
        audioMessage(event.data);
    }
});