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
const wss = new WebSocketServer({ server: server});

app.use(express.static("public", { extensions: ["html"] }));
app.use(bodyParser.urlencoded({ extended: true }));

// Websocket proxy
wss.on("connection", async (ws, req) => {
    const parameters = url.parse(req.url, true);

    switch(parameters.query.path) {
        case "stream":
            if (await GetPassword(parameters.query.password)) {
                ws.on("message", data => {
                    wss.clients.forEach(client => {
                        client.send(data);
                    });
                });
            }
        case "chat":
            ws.on("message", data => {
                wss.clients.forEach(client => {
                    client.send(data);
                });
            });
    }
});

//Start server listening
server.listen(PORT, () => {
    console.log("Server listening on port:", PORT);
});