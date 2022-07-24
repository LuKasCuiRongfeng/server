import { Request, Response, NextFunction } from "express";

export type User = {
    /** name 必须唯一 */
    name: string;
    nickName?: string;
    password?: string;
    friends?: string[];
    /** 带问候语的strangers */
    strangers?: Stranger[];
    avatar?: string;
};

export type Stranger = { name: string; hello?: string };

export type Msg = {
    name: string;
    date: number;
    msg: string;
    unread?: boolean;
};

export interface MiddleWare {
    (req?: Request, res?: Response, next?: NextFunction): any;
}

// socket
export interface ServerToClientEvents {
    "add-friend-request": (me: Stranger) => void;
    "private-chat": (msg: Msg, me: string) => void;
    "permit-add-friend": (me: string) => void;
    "file-upload-progress": (length: number) => void;
}

export interface ClientToServerEvents {
    "add-friend-request": (friend: string, me: Stranger) => void;
    "private-chat": (msg: Msg, me: string, members: string[]) => void;
    "name:socketId": (name: string) => void;
    "permit-add-friend": (friend: string, me: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
}
