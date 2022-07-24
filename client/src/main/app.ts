import { FileUpload } from "@/types";
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

        await createLoginWin(this);

        // 务必在最后注册
        this.registerIpcEvent();
    }

    /** 注册所有的ipc */
    private registerIpcEvent() {
        ipcMain.on(IpcChannel.CREATE_WIN, (e, args: WinConstructorOptions) => {
            try {
                this.windowManager.createWin(args);
            } catch (error) {
                console.error(error);
            }
        });

        ipcMain.on(IpcChannel.SEND_MSG, (e, args: CrossWinData) => {
            try {
                this.windowManager.sendMsg(args.key, args.data);
            } catch (error) {
                console.error(error);
            }
        });

        ipcMain.on(IpcChannel.WINDOW_CONTROL, (e, args: ControlId) => {
            try {
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
            } catch (error) {
                console.error(error);
            }
        });

        ipcMain.handle(IpcChannel.ELECTRON_STORE, (e, args) => {
            try {
                if (typeof args === "string") {
                    // get
                    return this.store.get(args);
                }
                // set
                this.store.set(args);
            } catch (error) {
                console.error(error);
            }
        });

        ipcMain.on(IpcChannel.WINDOW_LOGIN, async (e, args) => {
            try {
                const { name, exit } = args;
                if (exit === true) {
                    // 退出登录
                    this.store.delete("name");
                    this.store.delete("startDate");
                    this.store.delete("theme");
                    await createLoginWin(this);
                    this.windowManager.destroy("home");
                    return;
                }

                this.store.set({
                    name,
                    startDate: Date.now(),
                    theme: "dark",
                });
                // 登录成功，关闭login窗口，打开主窗口
                await createHomeWin(this);
                this.windowManager.destroy("login");
            } catch (error) {
                console.error(error);
            }
        });

        ipcMain.handle(IpcChannel.FILE_STAT, (e, filepath) => {
            try {
                return statSync(filepath);
            } catch (error) {
                console.error(error);
            }
        });

        // 文件上传
        ipcMain.handle(IpcChannel.FILE_UPLOAD, async (e, args: FileUpload) => {
            try {
                const {
                    name,
                    url,
                    filepath,
                    maxSize = 100 * 1024 * 1024,
                } = args;
                const filesize = statSync(filepath).size;

                if (filesize > maxSize) {
                    return { error: "文件大小超过限制" };
                }
                return uploadFile({ name, url, filepath });
            } catch (error) {
                console.error(error);
            }
        });

        ipcMain.handle(IpcChannel.OPEN_DIALOG, async (e, filters) => {
            try {
                const res = await dialog.showOpenDialog({
                    filters,
                    properties: ["openFile", "dontAddToRecent"],
                });

                if (res.canceled) {
                    return {
                        canceled: true,
                    };
                }

                const filepath = res.filePaths[0];
                const filesize = statSync(filepath);

                return {
                    canceled: false,
                    filepath,
                    filesize,
                };
            } catch (error) {
                console.error(error);
            }
        });
    }
}
