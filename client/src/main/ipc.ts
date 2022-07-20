import { CrossWinData, WinConstructorOptions } from "./core/window-manager";

// 过期时间设置为 12小时
export const MAX_AGE = 1000 * 60 * 60 * 12;

export enum IpcChannel {
    /** 特指跨窗口的消息 */
    SEND_MSG = "SEND_MSG",
    CREATE_WIN = "CREATE_WIN",
    WINDOW_CONTROL = "WINDOW_CONTROL",
    ELECTRON_STORE = "ELECTRON_STORE",
    WINDOW_LOGIN = "WINDOW_LOGIN",
    USER_INFO = "USER_INFO",
    OPEN_DIALOG = "OPEN_DIALOG",
    FILE_UPLOAD = "FILE_UPLOAD",
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
