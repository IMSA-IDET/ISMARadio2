import express from "express"
import http from "http"
import bodyParser from "body-parser"
import { WebSocketServer } from "ws";
import fs from "fs"

// Config
const PORT = 3001;

// App Setup
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server: server });

app.use(express.static("public", { extensions: ["html"] }))
app.use(bodyParser.urlencoded({ extended: true }))

// Websocket proxy
/*wss.on("connection", ws => {
    ws.on("message", data => {
        wss.clients.forEach(client =>{
            client.send(data);
        });
    });
});*/

wss.on("connection", ws => {
    ws.on("message", data => {
        wss.clients.forEach(client =>{
            console.log(typeof data)
            let test = new Float32Array(data)//

            for (let i = 0; i < 44100 * 2; i++) {
                test[i] = Math.sin(i)
            }

            client.send(data);
        });
    });
});

//Start server listening
server.listen(PORT, () => {
    console.log("Server listening on port:", PORT)
})