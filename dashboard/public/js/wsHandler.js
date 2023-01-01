const serverURL = GetSocketURL();

let server = new WebSocket(serverURL);

server.addEventListener("message", event => {
    try {
        const json = JSON.parse(event.data);

        if (json.route == "listeners") {
            //listenersMessage(json.data);
        }
    } catch(_) {
        audioMessage(event.data);
    }
});