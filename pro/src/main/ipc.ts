import { WinData } from "./core/window-manager";

export enum IpcChannel {
    SEND_MSG = "SEND_MSG",
    CREATE_WIN = "CREATE_WIN",
}

export type IpcChannelType = keyof typeof IpcChannel;

export type IpcDataType = { key: string; data?: WinData } | string;
