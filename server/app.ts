import express from "express";
import { Router } from "./Router";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

// socket
interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

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

const connectSocketMap: Map<string, string> = new Map();

io.on("connection", socket => {
    console.log("连接上了 ...", socket.id);
    socket.on("private-chat", (msg, me, members) => {
        const socketId = connectSocketMap.get(members[0]);
        socket.to(socketId).emit("private-chat", msg, me);
    });

    socket.on("name:socketId", (name, socketId) => {
        // 连接上后把 name 和socketId 保存下来
        console.log("name:socketId: ", name, socketId);
        connectSocketMap.set(name, socketId);
    });

    socket.on("add-friend-request", (friend, me) => {
        console.log(friend, me);
        const socketId = connectSocketMap.get(friend);
        console.log(
            "friend socketid: ",
            socketId,
            JSON.stringify(connectSocketMap)
        );
        if (socketId) {
            socket.to(socketId).emit("add-freind-request", me);
        }
    });

    socket.on("permitfriend", (friend, me) => {
        const socketId = connectSocketMap.get(friend);
        console.log("permit socket: ", socketId);
        if (socketId) {
            socket.to(socketId).emit("permitfriend", me);
        }
    });

    socket.on("disconnect", reason => {
        console.log("server socket disconnected: ", reason);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server listening port ${PORT}`);
});
