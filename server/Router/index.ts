import { Express } from "express";
import { lolRouter } from "./lol";
import { userRouter } from "./user";

export class Router {
    constructor(app: Express) {
        app.use("/lol", lolRouter());
        app.use("/user", userRouter());
    }
}
