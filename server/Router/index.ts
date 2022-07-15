import { Express } from "express";
import { router as lolRouter } from "./lol";
import { router as LoginRouter } from "./login";

export class Router {
    constructor(app: Express) {
        app.use("/lol", lolRouter());
        app.use("/user", LoginRouter());
    }
}
