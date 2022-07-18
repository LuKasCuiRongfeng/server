import { ipcMain } from "electron";
import Store from "electron-store";
import { URL } from "./core/url";
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
                this.store.delete("userId");
                await createLoginWin(this);
                this.windowManager.destroy("home");
                return;
            }
            // 把 userId 保存在本地，并更新过期时间
            this.store.set({
                userId: args.userId,
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
                userId: this.store.get("userId"),
                socketId: this.store.get("socketId"),
            };
            return userInfo;
        });
    }
}