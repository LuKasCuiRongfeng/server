import { app } from "electron";

/** 当前环境是否是开发环境 */
export function isDev() {
    return !app.isPackaged;
}
