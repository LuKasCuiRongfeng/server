import { io } from "socket.io-client";

const socket = io("ws://localhost:2000");

socket.on("connect", () => {
    console.log("socket.id: ", socket.id);
});

socket.on("disconnect", () => {
    console.error("socket disconnect");
});

export default socket;
