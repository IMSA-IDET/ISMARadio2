import express from "express"
import { Server } from "socket.io"
import http from "http"
import bodyParser from "body-parser"
import fs from "fs"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Config
const PORT = 3001;

// App Setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static("public", { extensions: ["html"] }))
app.use(bodyParser.urlencoded({ extended: true }))





//Start server listening
server.listen(PORT, () => {
    console.log("Server listening on port:", PORT)
})