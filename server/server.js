import express, { json } from "express"
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
const wss = new WebSocketServer({ server: server });

app.use(express.static("public", { extensions: ["html"] }));
app.use(bodyParser.urlencoded({ extended: true }));

const generateID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + "-" + s4();
}

let socketIDs = {
    "stream": [],
    "chat": []
};

// Websocket proxy
wss.on("connection", async (ws, req) => {
    const parameters = url.parse(req.url, true);

    if (parameters.query.path != undefined) {
        ws.id = generateID();
        socketIDs[parameters.query.path].push(ws.id);

        switch (parameters.query.path) {
            case "stream":
                if (await GetPassword(parameters.query.password)) {
                    ws.on("message", data => {
                        wss.clients.forEach(client => {
                            if (socketIDs["stream"].includes(client.id)) {
                                client.send(data);
                            }
                        });
                    });
                }

                break;
            case "chat":
                ws.on("message", data => {
                    wss.clients.forEach(client => {
                        if (socketIDs["chat"].includes(client.id)) {
                            client.send(data);
                        }
                    });
                });

                break;
        }
    }
});

//Start server listening
server.listen(PORT, () => {
    console.log("Server listening on port:", PORT);
});