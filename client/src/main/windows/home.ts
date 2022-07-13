import { resolve } from "path";
import App from "../app";

export async function createHomeWin(app: App) {
    const win = app.windowManager.createWin({
        key: "home",
        browserWindowConstructorOptions: {
            width: 1500,
            webPreferences: {
                preload: resolve(__dirname, "preload/home.js"),
            },
        },
    });
    return win;
}
