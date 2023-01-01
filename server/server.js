import express, { json } from "express"
import http from "http"
import bodyParser from "body-parser"
import { WebSocketServer } from "ws"
import url from "url"
import { GetAllShows, GetPassword, GetSchedule } from "./db.js"

// Config
const PORT = 3001;

// App Setup
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server: server });

app.use(express.static("public", { extensions: ["html"] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Info
let schedule;
let shows;
let currentListeners = 0;

GetAllShows().then(s => {
    shows = s;
});

const scheduleLookUp = async () => {
    schedule = await GetSchedule();
    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            "route": "info",
            "data": schedule
        }));
    });
    setTimeout(() => scheduleLookUp(), schedule.timeout);
}
scheduleLookUp();

// Websocket proxy
wss.on("connection", async (ws, req) => {
    const parameters = url.parse(req.url, true);

    if (await GetPassword(parameters.query.password)) {
        ws.on("message", data => {
            wss.clients.forEach(client => {
                client.send(data);
            });
        });
    } else {
        ws.on("message", data => {
            wss.clients.forEach(client => {
                const stringData = data.toString();
                const route = JSON.parse(stringData).route;
                if (route == "ping" || route == "chat") {
                    client.send(JSON.stringify({
                        "route": route,
                        "data": stringData
                    }));
                }
            });
        });
    }

    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            "route": "listeners",
            "data": wss.clients.size - 1
        }));
    });
});

app.get("/scheduleData", (req, res) => {
    res.json(schedule);
});

app.get("/showsData", (req, res) => {
    res.json(shows);
});

app.post("/checkPassword", async (req, res) => {
    res.send(await GetPassword(req.body.password));
});

//Start server listening
server.listen(PORT, () => {
    console.log("Server listening on port:", PORT);
});