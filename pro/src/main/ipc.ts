import { CrossWinData, WinConstructorOptions } from "./core/window-manager";

export enum IpcChannel {
    /** 特指跨窗口的消息 */
    SEND_MSG = "SEND_MSG",
    CREATE_WIN = "CREATE_WIN",
}

export type IpcChannelType = keyof typeof IpcChannel;

export type IpcDataType =
    | WinConstructorOptions // 创建窗口时
    | string // 普通字符串数据
    | CrossWinData; // 向另外一个窗口传递数据时
