import express from "express";
import { fstat, readFile, createReadStream } from "fs";
import { resolve } from "path";

export const bigFile = express.Router();

bigFile.get("/", (req, res, next) => {
    // readFile(resolve(__dirname, "../public/pdf.pdf"), (err, data) => {
    //     res.end(data)
    // })
    const stream = createReadStream(resolve(__dirname, "../public/pdf.pdf"));
    stream.pipe(res);
});

type A = 1;
type B = 2;
const a: unknown = 2;
const c = 2;
