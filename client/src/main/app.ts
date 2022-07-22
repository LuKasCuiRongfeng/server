import { dialog, ipcMain } from "electron";
import Store from "electron-store";
import { statSync } from "fs";
import { URL } from "./core/url";
import { uploadFile } from "./core/utils";
import {
    CrossWinData,
    WinConstructorOptions,
    WindowManager,
} from "./core/window-manager";
import { ControlId, IpcChannel } from "./ipc";
import { createHomeWin } from "./windows/home";
import { createLoginWin } from "./windows/login";

export default class App {
    windowManager: WindowManager;
    URL: URL;
    store: Store;
    constructor() {
        this.init();
    }

    private async init() {
        this.windowManager = new WindowManager(this);
        this.URL = new URL(this);
        this.store = new Store();

        // 默认 dark 主题
        this.store.set("theme", "dark");

        await createLoginWin(this);

        // 务必在最后注册
        this.registerIpcEvent();
    }

    /** 注册所有的ipc */
    private registerIpcEvent() {
        ipcMain.on(IpcChannel.CREATE_WIN, (e, args: WinConstructorOptions) => {
            this.windowManager.createWin(args);
        });

        ipcMain.on(IpcChannel.SEND_MSG, (e, args: CrossWinData) => {
            this.windowManager.sendMsg(args.key, args.data);
        });

        ipcMain.on(IpcChannel.WINDOW_CONTROL, (e, args: ControlId) => {
            const win = this.windowManager.getFocusWin();
            if (win == null) return;
            switch (args) {
                case ControlId.CLOSE:
                    win.close();
                    break;
                case ControlId.MAX:
                    win.isMaximized() ? win.unmaximize() : win.maximize();
                    break;
                case ControlId.MIN:
                    win.minimize();
                    break;
                default:
            }
        });

        ipcMain.handle(IpcChannel.ELECTRON_STORE, (e, args) => {
            if (typeof args === "string") {
                // get
                return this.store.get(args);
            } else if (typeof args === "object") {
                // set
                this.store.set(args);
                return true;
            }
            return;
        });

        ipcMain.on(IpcChannel.WINDOW_LOGIN, async (e, args) => {
            if (args.exit === true) {
                // 推出登录
                this.store.delete("name");
                await createLoginWin(this);
                this.windowManager.destroy("home");
                return;
            }
            console.log(args.name);
            this.store.set({
                name: args.name,
                startDate: Date.now(),
            });
            // 登录成功，关闭login窗口，打开主窗口
            await createHomeWin(this);
            this.windowManager.destroy("login");
        });

        ipcMain.handle(IpcChannel.USER_INFO, (e, socketId) => {
            socketId && this.store.set("socketId", socketId);
            const userInfo = {
                name: this.store.get("name"),
                socketId: this.store.get("socketId"),
            };
            return userInfo;
        });

        ipcMain.handle(IpcChannel.FILE_STAT, (e, filepath) => {
            try {
                return statSync(filepath);
            } catch (err) {
                console.error(err);
            }
        });

        ipcMain.handle(IpcChannel.FILE_UPLOAD, async (e, { stat, upload }) => {
            try {
                if (stat) {
                    // 只是统计
                    const { filters, maxSize = 100 * 1024 * 1024 } = stat;
                    const res = await dialog.showOpenDialog({
                        buttonLabel: "确定",
                        filters,
                        properties: ["openFile", "dontAddToRecent"],
                    });

                    if (res.canceled) {
                        return {
                            canceled: true,
                        };
                    }

                    const filepath = res.filePaths[0];

                    let error = "";

                    const filesize = statSync(filepath).size;

                    if (filesize > maxSize) {
                        error = "图片大小超过限制尺寸";
                    }

                    return {
                        filesize,
                        filepath,
                        error,
                        canceled: false,
                    };
                }
                if (upload) {
                    const { filepath, url, name } = upload;
                    const res = await uploadFile({
                        filepath,
                        url,
                        name,
                    });

                    return res;
                }
                return { error: "文件错误" };
            } catch (err) {
                console.error(err);
            }
        });
    }
}
