import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import type App from "../app";
import { merge } from "lodash";

/** 窗口间传递的数据类型 */
export interface WinData {
    type: string;
    payload: any;
}

export interface WinConstructorOptions {
    /** 窗口的唯一标识 */
    key: string;
    /** 是否向窗口传递数据 */
    data?: WinData;
    /** 是否禁用默认的关闭行为，default false */
    preventDefaultClose?: boolean;
    /** 是否打开开发者工具，default true */
    openDevTools?: boolean;
    /** electron 窗口创建选项 */
    browserWindowConstructorOptions?: BrowserWindowConstructorOptions;
}

const defaultBrowserWindowConstructorOptions: BrowserWindowConstructorOptions =
    {
        width: 700,
        height: 700,
        show: false,
        webPreferences: {},
    };

/** 窗口管理类 */
export class WindowManager {
    /** 所有的窗口 */
    wins: Map<string, BrowserWindow> = new Map();

    constructor(public app: App) {}

    /** 创建窗口 */
    createWin(winConstructorOptions: WinConstructorOptions) {
        const {
            key,
            data,
            openDevTools = true,
            preventDefaultClose = false,
            browserWindowConstructorOptions,
        } = winConstructorOptions;

        let win = this.wins.get(key);
        if (win != null) {
            // 窗口已经存在，直接聚焦
            win.focus();
            return win;
        }
        // 窗口不存在，创建新的窗口
        win = new BrowserWindow(
            merge(
                defaultBrowserWindowConstructorOptions,
                browserWindowConstructorOptions
            )
        );

        this.wins.set(key, win);

        win.loadURL(this.app.URL.getLoadURL(key));

        win.on("ready-to-show", () => {
            win.show();
            if (openDevTools === true) {
                win.webContents.openDevTools();
            }
            if (data != null) {
                this.sendMsg(key, data);
            }
        });

        win.on("close", e => {
            if (preventDefaultClose === true) {
                e.preventDefault();
                return;
            }
        });

        return win;
    }

    /** 向窗口传递数据，可以是当前窗口，也可以跨窗口 */
    sendMsg(key: string, data: WinData) {
        const win = this.wins.get(key);
        if (win == null) {
            console.warn("窗口不存在");
            return;
        }
        win.webContents.send("", data);
    }

    /** 获取焦点窗口 */
    getFocusWin() {
        return [...this.wins.values()].find(e => e.isFocused());
    }

    /** 根据key获取窗口 */
    getWin(key: string) {
        return this.wins.get(key);
    }

    /** 根据key销毁窗口 */
    destroy(key: string) {
        const win = this.wins.get(key);
        if (win == null) {
            return;
        }
        win.destroy();
        this.wins.delete(key);
    }
}
