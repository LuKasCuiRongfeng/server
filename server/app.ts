import express, { application } from "express";
import { Router } from "./Router";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import multer from "multer";
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
app.use(express.static("public"));
app.use("/static", express.static("assets"));

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

// const connectSocketMap: Map<string, string> = new Map();

/** 打开多个窗口，可能会造成多个 socketId */
function findSockets(name: string) {
    const sockets = [...io.sockets.sockets.values()].filter(
        socket => socket.data.name === name
    );
    console.log("size", io.sockets.sockets.size, sockets.length);
    return sockets;
}

io.on("connection", socket => {
    console.log("连接上了 ...", socket.id);

    socket.on("private-chat", (msg, me, members) => {
        // console.log("private-chat", msg, me, members);
        // const socketId = connectSocketMap.get(members[0]);
        // socket.to(socketId).emit("private-chat", msg, me);

        const sockets = findSockets(members[0]);
        sockets.forEach(el => {
            console.log(el.id, msg, me);
            el.emit("private-chat", msg, me);
        });
    });

    socket.on("name:socketId", (name, socketId) => {
        // 连接上后把 name 和socketId 保存下来
        console.log("name:socketId: ", name, socketId);
        socket.data.name = name;
        // connectSocketMap.set(name, socketId);
    });

    socket.on("add-friend-request", (friend, me) => {
        // const socketId = connectSocketMap.get(friend);
        // console.log("add-friend-request", friend, me, socketId);
        // if (socketId) {
        //     socket.to(socketId).emit("add-friend-request", me);
        // }
        const sockets = findSockets(friend);
        sockets.forEach(el => {
            socket.to(el.id).emit("add-friend-request", me);
        });
    });

    socket.on("permit-add-friend", (friend, me) => {
        // const socketId = connectSocketMap.get(friend);
        // console.log("permit-add-friend", friend, me, socketId);
        // if (socketId) {
        //     socket.to(socketId).emit("permit-add-friend", me);
        // }
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
