import { WinConstructorOptions, WinData } from "./core/window-manager";

export enum IpcChannel {
    SEND_MSG = "SEND_MSG",
    CREATE_WIN = "CREATE_WIN",
}

export type IpcChannelType = keyof typeof IpcChannel;

export type IpcDataType =
    | WinConstructorOptions // 创建窗口时
    | string // 普通字符串数据
    | { key: string; data: WinData }; // 向另外一个窗口传递数据时
