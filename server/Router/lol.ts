import express from "express";
import { App } from "../app";

export function router(app: App) {
    const _router = express.Router();
    const lol = app.mongoDb.connectDb("games").collection("lol");

    _router.get("/herolist", async (req, res) => {
        const list = await lol.find().toArray();
        res.send({
            status: "success",
            error: "",
            data: list,
        });
    });

    _router.post("/addhero", async (req, res) => {
        const body = req.body;
        const result = await lol.insertOne(body);
        const id = result.insertedId;
        if (id) {
            res.send({
                status: "success",
                error: "",
                data: id,
            });
        } else {
            res.send({
                status: "failed",
                error: "未知的错误",
                data: id,
            });
        }
    });

    app.server.use("/lol", _router);
}
