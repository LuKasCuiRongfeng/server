import { CrossWinData, WinConstructorOptions } from "./core/window-manager";

export enum IpcChannel {
    /** 特指跨窗口的消息 */
    SEND_MSG = "SEND_MSG",
    CREATE_WIN = "CREATE_WIN",
    WINDOW_CONTROL = "WINDOW_CONTROL",
    ELECTRON_STORE = "ELECTRON_STORE",
}

export enum ControlId {
    CLOSE = 0,
    MAX = 1,
    MIN = -1,
}

export type IpcChannelType = keyof typeof IpcChannel;

type PrimaryDataType = string | number | boolean | symbol | Record<string, any>;

export type IpcDataType =
    | WinConstructorOptions // 创建窗口时
    | PrimaryDataType // 普通字符串数据
    | CrossWinData; // 向另外一个窗口传递数据时
