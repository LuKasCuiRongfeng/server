import { Express } from "express";
import { userRouter } from "./user";

export class Router {
    constructor(app: Express) {
        app.use("/user", userRouter());
    }
}
