import { app, BrowserWindow } from "electron";
import App from "./app";
import { createHomeWin } from "./windows/home";

app.whenReady().then(async () => {
    const _app = new App();
    await createHomeWin(_app);
    app.on("activate", async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createHomeWin(_app);
        }
    });

    makeSingleInstance();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// 确保只有一个app实例
const makeSingleInstance = () => {
    if (process.mas === true) {
        return;
    }
    const isLock = app.requestSingleInstanceLock();
    if (isLock === false) {
        app.quit();
    } else {
        app.on("second-instance", () => {
            console.error();
        });
    }
};
