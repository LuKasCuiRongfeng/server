import { MAX_AGE } from "@main/ipc";
import { resolve } from "path";
import App from "../app";
import { createHomeWin } from "./home";

export async function createLoginWin(app: App) {
    const user = app.store.get("name");
    const startDate = app.store.get("startDate") as number;
    if (user != undefined && Date.now() - startDate < MAX_AGE) {
        // 登录过且未过期，直接进入主页
        await createHomeWin(app);
        return;
    }

    app.store.delete("name");
    app.store.delete("startDate");
    app.store.delete("theme");

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
