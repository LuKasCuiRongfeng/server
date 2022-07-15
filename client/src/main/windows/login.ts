import { MAX_AGE } from "@main/ipc";
import { resolve } from "path";
import App from "../app";
import { createHomeWin } from "./home";

export async function createLoginWin(app: App) {
    console.log(app.store.path);
    // const sessionId = app.store.get("sessionId");
    // const startDate = app.store.get("startDate") as number;
    // if (sessionId && Date.now() - startDate < MAX_AGE) {
    //     // 登录过且未过期，直接进入主页面
    //     await createHomeWin(app);
    //     return;
    // }

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
