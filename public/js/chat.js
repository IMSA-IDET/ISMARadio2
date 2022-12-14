const chatServerUrl = `ws://${window.location.hostname}:${window.location.port}/livechat`;

const randomNameColor = Math.floor(Math.random()*16777215).toString(16);
let serversocket = new WebSocket(chatServerUrl);


function sendChatMessage(username, message) {
    const container = document.createElement('div'); container.classList.add('chatMessage');
    const name = document.createElement('div'); name.classList.add('chatSender');
    container.append(name)
    const msg = document.createElement('div'); msg.classList.add('chatContent')
    container.append(msg)
    name.innerText = username+ ": ";
    msg.innerText = message;
    name.style.color = randomNameColor
    document.getElementById('chat').append(container)
    console.log(username, message)
}

serversocket.addEventListener("message", async event => {
content = JSON.parse(event.data)
sendChatMessage(content.name, content.message)
})


