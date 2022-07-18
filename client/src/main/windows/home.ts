import { MAX_AGE } from "@main/ipc";
import { resolve } from "path";
import App from "../app";
import { createLoginWin } from "./login";

export async function createHomeWin(app: App) {
    const win = app.windowManager.createWin({
        key: "home",
        browserWindowConstructorOptions: {
            width: 1500,
            webPreferences: {
                preload: resolve(__dirname, "preload/preload.js"),
            },
        },
    });

    win.on("focus", async () => {
        // 每当窗口聚焦时，判断一下登录是否过期
        const startDate = app.store.get("startDate") as number;
        if (Date.now() - startDate >= MAX_AGE) {
            // 过期了，进入登录窗口
            app.store.delete("userId");
            await createLoginWin(app);
            win.destroy();
        }
    });

    return win;
}
