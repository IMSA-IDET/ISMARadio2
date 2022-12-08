import express from "express"
import { Server } from "socket.io"
import http from "http"
import bodyParser from "body-parser"
import fs from "fs"
//require("dotenv").config();

// Config
const PORT = 3001;

// Connection Tracker
var connections = 0;

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static("public", { extensions: ["html"] }))
app.use(bodyParser.urlencoded({ extended: true }))

//set views
app.set("views", __dirname + "/public/html")

//handle hostname change post
app.post("/sethost", (req, res) => {
    if (req.body.password == process.env.HOSTNAMEPASS) {
        var dat = JSON.parse(fs.readFileSync(__dirname + "/public/json/hostname.json"))
        dat.hostname = req.body.ip
        dat.port = req.body.port
        fs.writeFileSync(__dirname + "/public/json/hostname.json", JSON.stringify(dat))
        res.end(`host set to ${req.body.ip}:${req.body.port}`)
    } else {
        res.end("password invalid")
    }
})


//Route "/" to home.html dynamically
app.get("/", (req, res) => {
    res.render("home.html")
})


//Socket.io routing
io.on("connection", (connection) => {
    var address = connection.handshake.address;
    connections += 1
    connection.on("chat-message-receive", msg => {
        msg.name = address.replace("::ffff:", "")
        io.emit("chat-message-receive", msg)
    })
    io.emit("connectionChange", connections)

    connection.on("disconnect", () => {
        connections -= 1
        io.emit("connectionChange", connections)
    })
})


//Start server listening
server.listen(PORT, () => {
    console.log("Server listening on port:", PORT)
})