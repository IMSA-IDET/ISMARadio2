const serverURL = `ws://${window.location.hostname}:${window.location.port}`;

if (location.protocol === "https:") {
    serverURL = serverURL.replace("ws:", "wss:");
}

let server = new WebSocket(serverURL);

server.addEventListener("message", event => {
    try {
        const json = JSON.parse(event.data);

        switch(json.route) {
            case "chat":
                chatMessage(json.data);
                break;
            case "info":
                infoMessage(json.data);
                break;
            case "listeners":
                listenersMessage(json.data);
        }
    } catch(_) {
        audioMessage(event.data);
    }
});