import { App } from "../app";
import { router as router1 } from "./bigFile";
import { router } from "./lol";
import { router as router2 } from "./recommend";
import { router as LoginRouter } from "./login";

export class Router {
    constructor(app: App) {
        router1(app);
        router2(app);
        router(app);
        LoginRouter(app);
    }
}
