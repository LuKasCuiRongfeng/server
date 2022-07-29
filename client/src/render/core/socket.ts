import { Msg, Stranger } from "@/types";
import { io, Socket } from "socket.io-client";
import { HOST } from "./const";
import { getLocalStore } from "./ipc";

// socket
interface ServerToClientEvents {
    "add-friend-request": (stranger: Stranger) => void;
    "private-chat": (msg: Msg, friend: string) => void;
    "permit-add-friend": (friend: string) => void;
    "file-upload-progress": (
        newFilename: string,
        currentLength: number
    ) => void;
    "sync-chat": (msgs: Msg[], friend: string) => void;
    "sync-chat-reply": (msgs: Msg[], friend: string) => void;
}

interface ClientToServerEvents {
    "add-friend-request": (stranger: string, me: Stranger) => void;
    "private-chat": (msg: Msg, me: string, members: string[]) => void;
    "name:socketId": (name: string) => void;
    "permit-add-friend": (friend: string, me: string) => void;
    "sync-chat": (msgs: Msg[], me: string, friend: string) => void;
    "sync-chat-reply": (msgs: Msg[], me: string, friend: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(HOST);

socket.on("connect", async () => {
    const res = await getLocalStore("name");
    checKConnect();
    function checKConnect() {
        // 轮询直到拿到 name
        setTimeout(() => {
            if (!res) {
                checKConnect();
            } else {
                socket.emit("name:socketId", res);
            }
        }, 1000);
    }
});

socket.on("disconnect", reason => {
    console.error("socket disconnected: ", reason);
});

export default socket;
