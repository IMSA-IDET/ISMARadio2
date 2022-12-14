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

app.use(express.static("public", { extensions: ["html"] }));
app.use(bodyParser.urlencoded({ extended: true }));

// Websocket proxy
streamServer.on("connection", (ws, req) => {
    const parameters = url.parse(req.url, true);
    if (GetPassword(parameters.query.password)) {
        ws.on("message", data => {
            streamServer.clients.forEach(client => {
                client.send(data);
            });
        });
    }
});

//Start server listening
server.listen(PORT, () => {
    console.log("Server listening on port:", PORT);
});