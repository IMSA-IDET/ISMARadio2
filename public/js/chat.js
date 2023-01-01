const MAX_CHAT_ELEMENTS = 100;

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

    const chat = document.getElementById("chat");
    chat.prepend(container);
    if (chat.children.length > MAX_CHAT_ELEMENTS) {
        chat.children[chat.children.length - 1].remove();
    }
    chat.scrollTop = chat.scrollHeight;
}

const chatMessage = async data => {
    const json = JSON.parse(data);
    renderMessage(json.name, json.message);
}

const sendMessageHandler = () => {
    const input = document.getElementById("chatInput");
    if (input.value == "") {
        return false;
    }

    server.send(JSON.stringify({
        "route": "chat",
        "name": localStorage.getItem("username"),
        "message": input.value
    }));

    document.getElementById("chatInput").value = "";
}

document.getElementById("msgsend").addEventListener("click", sendMessageHandler);
document.onkeyup = (key) => {if (key.key == "Enter") sendMessageHandler() }