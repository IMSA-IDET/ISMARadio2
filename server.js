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
const wss = new WebSocketServer({ server: server, path: "/stream" });

app.use(express.static("public", { extensions: ["html"] }));
app.use(bodyParser.urlencoded({ extended: true }));

// Websocket proxy
wss.on("connection", ws => {
    ws.on("message", data => {
        wss.clients.forEach(client => {
            client.send(data);
        });
    });
});

//Start server listening
server.listen(PORT, () => {
    console.log("Server listening on port:", PORT)
})