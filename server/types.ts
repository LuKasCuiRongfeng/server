import { Request, Response, NextFunction } from "express";

export type User = {
    name?: string;
    nickName?: string;
    password?: string;
    friends?: string[];
    avatar?: string;
};

export type Hero = {
    name: string;
    role: "top" | "jungle" | "middle" | "AD" | "sup";
    stars: 1 | 2 | 3 | 4 | 5;
    difficult: "normal" | "easy" | "difficult" | "hell";
};

export interface MiddleWare {
    (req?: Request, res?: Response, next?: NextFunction): any;
}

// socket
export interface ServerToClientEvents {
    "add-friend-request": (me: string) => void;
    "private-chat": (msg: string, me: string) => void;
    "permit-add-friend": (me: string) => void;
    "test:socket": (msg: string) => void;
}

export interface ClientToServerEvents {
    "add-friend-request": (friend: string, me: string) => void;
    "private-chat": (msg: string, me: string, members: string[]) => void;
    "name:socketId": (name: string, socketId: string) => void;
    "permit-add-friend": (friend: string, me: string) => void;
    "test:socket": (msg: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
}
