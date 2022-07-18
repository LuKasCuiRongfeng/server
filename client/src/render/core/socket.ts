import { IpcChannel } from "@main/ipc";
import { io } from "socket.io-client";

const socket = io("ws://localhost:2000");

socket.on("connect", () => {
    console.log("socket connected@: ", socket.id);
    window.ipcRenderer.invoke(IpcChannel.USER_INFO, socket.id);
});

socket.on("disconnect", reason => {
    console.error("socket disconnected: ", reason);
});

export default socket;
