import express from "express"
import http from "http"
import bodyParser from "body-parser"
import { WebSocketServer } from "ws"
import url from "url"
import { GetPassword } from "./db.js"

// Config
const PORT = 3001;

// App Setup
const app = express();
const server = http.createServer(app);
const streamServer = new WebSocketServer({ server: server, path: "/stream" });
const chatSocket = new WebSocketServer({ server: server, path: "/livechat" });

app.use(express.static("public", { extensions: ["html"] }));
app.use(bodyParser.urlencoded({ extended: true }));

// Websocket proxy
streamServer.on("connection", async (ws, req) => {
    const parameters = url.parse(req.url, true);
    if (await GetPassword(parameters.query.password)) {
        ws.on("message", data => {
            streamServer.clients.forEach(client => {
                client.send(data);
            });
        });
    }
});
//Start server listening

//chat socket
chatSocket.on('connection', (ws,req)=> {
    ws.on('message', data=>{
        chatSocket.clients.forEach(client=>{
            client.send(data)
        })
    })
    
})


server.listen(PORT, () => {
    console.log("Server listening on port:", PORT);
});