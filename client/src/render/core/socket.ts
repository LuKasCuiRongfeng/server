import { Msg, SafeUser, Stranger } from "@/types";
import { io, Socket } from "socket.io-client";
import { HOST } from "./const";
import { getLocalStore } from "./ipc";

// socket
interface ServerToClientEvents {
    "add-friend-request": (strangers: Stranger) => void;
    "private-chat": (msg: Msg, friend: SafeUser) => void;
    "permit-add-friend": (friend: SafeUser) => void;
    "file-upload-progress": (length: number) => void;
}

interface ClientToServerEvents {
    "add-friend-request": (strangers: string, me: Stranger) => void;
    "private-chat": (msg: Msg, me: SafeUser, members: SafeUser[]) => void;
    "name:socketId": (name: string) => void;
    "permit-add-friend": (friend: SafeUser, me: SafeUser) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(HOST);

socket.on("connect", async () => {
    const res = await getLocalStore("user");
    checKConnect();
    function checKConnect() {
        // 轮询直到拿到 name
        setTimeout(() => {
            if (!res || res.name == undefined) {
                checKConnect();
            } else {
                socket.emit("name:socketId", res.name);
            }
        }, 1000);
    }
});

socket.on("disconnect", reason => {
    console.error("socket disconnected: ", reason);
});

export default socket;
