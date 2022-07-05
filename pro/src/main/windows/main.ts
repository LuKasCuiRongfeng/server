import App from "../app";

export async function createMainWin(app: App) {
    const win = app.windowManager.createWin({
        key: "home",
        browserWindowConstructorOptions: {
            width: 1500,
        },
    });
    return win;
}
