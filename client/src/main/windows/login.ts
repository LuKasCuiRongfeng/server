import { MAX_AGE } from "@main/ipc";
import { resolve } from "path";
import App from "../app";
import { createHomeWin } from "./home";

export async function createLoginWin(app: App) {
    const user = app.store.get("user") as any;
    if (user != undefined) {
        const startDate = user.startDate as number;
        // 登录过且未过期，直接进入主页
        if (Date.now() - startDate < MAX_AGE) {
            await createHomeWin(app);
            return;
        }
    }

    app.store.delete("user");

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
