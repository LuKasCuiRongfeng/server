import { MAX_AGE } from "@main/ipc";
import { resolve } from "path";
import App from "../app";
import { createHomeWin } from "./home";

export async function createLoginWin(app: App) {
    const name = app.store.get("name");
    const startDate = app.store.get("startDate") as number;
    if (name && Date.now() - startDate < MAX_AGE) {
        // 登录过且未过期，直接进入主页面，注意需要把socketId清楚掉
        await createHomeWin(app);
        return;
    }

    // 避免过期没有删除掉name，主动删除
    app.store.delete("name");

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
