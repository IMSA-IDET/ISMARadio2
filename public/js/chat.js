const chatServerUrl = `ws://${window.location.hostname}:${window.location.port}/?path=chat`;

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
    var data = await event.data.text()
    var jsondata = JSON.parse(data)
})

document.getElementById('msgsend').onclick = ()=>{
    serversocket.send(JSON.stringify({'name':"joe biben","message": "fortnite"}))
}
