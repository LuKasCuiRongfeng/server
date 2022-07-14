import express, { Express } from "express";
import { MongoDb } from "./mongodb";
import { Router } from "./Router";

export class App {
    server: Express;
    mongoDb: MongoDb;
    router: Router;

    constructor(port: number) {
        this.server = express();
        this.server.use(express.json());
        this.server.use(express.static("public"));

        this.mongoDb = new MongoDb();

        this.router = new Router(this);

        this.server.listen(port, () => {
            console.log(`Server listening port ${port}`);
        });
    }
}

new App(2000);
