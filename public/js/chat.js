const chatServerURL = `ws://${window.location.hostname}:${window.location.port}/?path=chat`;
let chatSocket = new WebSocket(chatServerURL);

if (localStorage.getItem("username") == null) {
    localStorage.setItem("username", "user" + Math.floor(Math.random() * 10000));
}

const getColorFromName = name => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ("00" + value.toString(16)).substr(-2);
    }

    return color;
}

const renderMessage = (username, message) => {
    const container = document.createElement("div");
    container.classList.add("chatMessage");

    const name = document.createElement("div");
    name.innerText = username + ": ";
    name.style.color = getColorFromName(username);
    name.classList.add("chatSender");
    container.append(name);

    const content = document.createElement("div");
    content.classList.add("chatContent");
    content.innerText = message;
    container.append(content);

    document.getElementById("chat").append(container);
}

chatSocket.addEventListener("message", async event => {
    const data = await event.data.text();
    const json = JSON.parse(data);

    renderMessage(json.name, json.message);
});

const sendMessageHandler = () => {
    const input = document.getElementById("chatInput");
    if (input.value == "") {
        return false;
    }

    chatSocket.send(JSON.stringify({
        "name": localStorage.getItem("username"),
        "message": input.value
    }));

    document.getElementById("chatInput").value = "";
}

document.getElementById("msgsend").addEventListener("click", sendMessageHandler);
document.onkeyup = (key) => {if (key.key == "Enter") sendMessageHandler() }