import express from "express";
import { Router } from "./Router";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 2000;

const app = express();
app.use(
    cors({
        origin: "http://localhost:12345",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

new Router(app);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:12345",
    },
});

io.on("connection", socket => {
    console.log("连接上了 ...", socket.id);
    socket.on("msg", (room, msg) => {
        socket.join(room);
        io.to(room).emit("msg", room, msg);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server listening port ${PORT}`);
});
