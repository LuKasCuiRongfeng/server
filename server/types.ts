import { Request, Response, NextFunction } from "express";
import { Dayjs } from "dayjs";

export type User = {
    /** name 必须唯一 */
    name?: string;
    nickName?: string;
    password?: string;
    friends?: SafeUser[];
    /** 带问候语的strangers */
    strangers?: Stranger[];
    avatar?: string;
};

/** 排除了 password 的安全 user */
export type SafeUser = Omit<User, "password" | "friends" | "strangers">;

export type Stranger = SafeUser & { hello?: string };

export type Msg = {
    name: string;
    date: Dayjs;
    msg: string;
    unread?: boolean;
};

export interface MiddleWare {
    (req?: Request, res?: Response, next?: NextFunction): any;
}

// socket
export interface ServerToClientEvents {
    "add-friend-request": (me: Stranger) => void;
    "private-chat": (msg: Msg, me: SafeUser) => void;
    "permit-add-friend": (me: SafeUser) => void;
    "file-upload-progress": (length: number) => void;
}

export interface ClientToServerEvents {
    "add-friend-request": (friend: string, me: Stranger) => void;
    "private-chat": (msg: Msg, me: SafeUser, members: SafeUser[]) => void;
    "name:socketId": (name: string) => void;
    "permit-add-friend": (friend: SafeUser, me: SafeUser) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
}
