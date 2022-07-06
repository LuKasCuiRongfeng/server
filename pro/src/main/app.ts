import { ipcMain } from "electron";
import { URL } from "./core/url";
import { WindowManager } from "./core/window-manager";
import { IpcChannel } from "./ipc";

export default class App {
    windowManager: WindowManager;
    URL: URL;
    constructor() {
        this.init();
    }

    private async init() {
        this.windowManager = new WindowManager(this);
        this.URL = new URL(this);

        // 务必在最后注册
        this.registerIpcEvent();
    }

    /** 注册所有的ipc */
    private registerIpcEvent() {
        ipcMain.on(IpcChannel.CREATE_WIN, (e, args) => {
            this.windowManager.createWin({
                key: args.key,
                data: args.data,
            });
        });
    }
}
