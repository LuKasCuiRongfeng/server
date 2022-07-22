import express from "express";
import { Router } from "./Router";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from "./types";

const PORT = 2000;

const app = express();
app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));

new Router(app);

const httpServer = createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer, {
    cors: {
        origin: "*",
    },
});

/** 打开多个窗口，可能会造成一个用户对应多个 socket */
export function findSockets(name: string) {
    const sockets = [...io.sockets.sockets.values()].filter(
        socket => socket.data.name === name
    );
    console.log("size", io.sockets.sockets.size, sockets.length, name);
    return sockets;
}

io.on("connection", socket => {
    socket.on("private-chat", (msg, me, members) => {
        const sockets = findSockets(members[0]);
        sockets.forEach(el => {
            console.log(el.id, msg, me);
            el.emit("private-chat", msg, me);
        });
    });

    socket.on("name:socketId", (name, socketId) => {
        // name 标记 socketId
        socket.data.name = name;
    });

    socket.on("add-friend-request", (friend, me) => {
        const sockets = findSockets(friend);
        sockets.forEach(el => {
            socket.to(el.id).emit("add-friend-request", me);
        });
    });

    socket.on("permit-add-friend", (friend, me) => {
        const sockets = findSockets(friend);
        sockets.forEach(el => {
            socket.to(el.id).emit("permit-add-friend", me);
        });
    });

    socket.on("disconnect", reason => {
        console.log("server socket disconnected: ", socket.id, reason);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server listening port ${PORT}`);
});
