import { IpcChannel } from "@main/ipc";
import { io, Socket } from "socket.io-client";
import { HOST } from "./const";

// socket
interface ServerToClientEvents {
    "add-friend-request": (stranger: string) => void;
    "private-chat": (msg: string, friend: string) => void;
    "permit-add-friend": (friend: string) => void;
}

interface ClientToServerEvents {
    "add-friend-request": (stranger: string, me: string) => void;
    "private-chat": (msg: string, me: string, members: string[]) => void;
    "name:socketId": (name: string, socketId: string) => void;
    "permit-add-friend": (friend: string, me: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(HOST);

socket.on("connect", async () => {
    console.log("socket connected@: ", socket.id);
    sessionStorage.setItem("socketId", socket.id);
    const res = await window.ipcRenderer.invoke(
        IpcChannel.USER_INFO,
        socket.id
    );
    checKConnect();
    function checKConnect() {
        setTimeout(() => {
            if (res.name == undefined) {
                checKConnect();
            } else {
                socket.emit("name:socketId", res.name, socket.id);
            }
        }, 1000);
    }
});

socket.on("disconnect", reason => {
    console.error("socket disconnected: ", reason);
});

export default socket;
