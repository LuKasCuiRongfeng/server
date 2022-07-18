import express from "express";
import { add, list } from "../controller/lol";

export function lolRouter() {
    const router = express.Router();

    router.get("/list", list);

    router.post("/add", add);

    return router;
}
