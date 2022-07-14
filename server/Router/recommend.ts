import express from "express";
import { App } from "../app";

export function router(app: App) {
    const _router = express.Router();

    _router.get("/list", (req, res) => {
        res.send({
            status: "success",
            error: "",
            data: [{ content: "燃爆英超", degree: 5 }],
        });
    });

    app.server.use("/recommend", _router);
}
