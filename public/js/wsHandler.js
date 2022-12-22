const serverURL = `ws://${window.location.hostname}:${window.location.port}`;

let server = new WebSocket(serverURL);

server.addEventListener("message", event => {
    const json = JSON.parse(event.data);

    switch(json.route) {
        case "stream":
            audioMessage(json.data);
            break;
        case "chat":
            chatMessage(json.data);
            break;
        case "info":
            infoMessage(json.data);
            break;
    }
});