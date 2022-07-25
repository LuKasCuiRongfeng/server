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
    console.log("total alive sockets: ", io.sockets.sockets.size);
    const sockets = [...io.sockets.sockets.values()].filter(
        socket => socket.data.name === name
    );
    return sockets;
}

io.on("connection", socket => {
    socket.on("private-chat", (msg, me, members) => {
        const sockets = findSockets(members[0]);
        sockets.forEach(el => {
            el.emit("private-chat", msg, me);
        });
    });

    socket.on("name:socketId", name => {
        // name 标记 socketId
        socket.data.name = name;
    });

    socket.on("sync-chat", (msgs, me, friend) => {
        const sockets = findSockets(friend);
        sockets.forEach(el => {
            el.emit("sync-chat", msgs, me);
        });
    });

    socket.on("disconnect", reason => {
        console.log("server socket disconnected: ", socket.id, reason);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server listening port ${PORT}`);
});
