import { IpcChannel } from "@main/ipc";
import { io } from "socket.io-client";

// socket
interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

const socket = io("ws://localhost:2000");

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
