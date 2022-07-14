import express from "express";
import { createReadStream } from "fs";
import { resolve } from "path";
import { App } from "../app";

export function router(app: App) {
    const _router = express.Router();

    _router.get("/", (req, res, next) => {
        // readFile(resolve(__dirname, "../public/pdf.pdf"), (err, data) => {
        //     res.end(data)
        // })
        const stream = createReadStream(
            resolve(__dirname, "../public/pdf.pdf")
        );
        stream.pipe(res);
    });

    app.server.use("/bigfile", _router);
}
