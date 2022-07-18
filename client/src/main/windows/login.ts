import { MAX_AGE } from "@main/ipc";
import { resolve } from "path";
import App from "../app";
import { createHomeWin } from "./home";

export async function createLoginWin(app: App) {
    const userId = app.store.get("userId");
    const startDate = app.store.get("startDate") as number;
    if (userId && Date.now() - startDate < MAX_AGE) {
        // 登录过且未过期，直接进入主页面，注意需要把socketId清楚掉
        app.store.delete("socketId");
        await createHomeWin(app);
        return;
    }

    const win = app.windowManager.createWin({
        key: "login",
        browserWindowConstructorOptions: {
            width: 800,
            height: 400,
            resizable: false,
            webPreferences: {
                preload: resolve(__dirname, "preload/preload.js"),
            },
        },
    });
    return win;
}
