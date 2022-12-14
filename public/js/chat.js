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

}

serversocket.addEventListener("message", async event => {
    var data = await event.data.text()
    var jsondata = JSON.parse(data)
    sendChatMessage(jsondata.name,jsondata.message)
})

const sendmessageHandle = ()=>{
    if (document.getElementById('chatInput').value == "") return false
    serversocket.send(JSON.stringify({'name':"joe biben","message": document.getElementById('chatInput').value}))
    document.getElementById('chatInput').value = ""
}
document.getElementById('msgsend').addEventListener("click", sendmessageHandle);


document.onkeyup = (key)=>{ if (key.key == "Enter") sendmessageHandle();}