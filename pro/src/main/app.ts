import { URL } from "./core/url";
import { WindowManager } from "./core/window-manager";

export default class App {
    windowManager: WindowManager;
    URL: URL;
    constructor() {
        this.init();
    }

    private async init() {
        this.windowManager = new WindowManager(this);
        this.URL = new URL(this);
    }
}
