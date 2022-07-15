import express from "express";
import { lol_addhero, lol_herolist } from "../controller/lol";

export function router() {
    const _router = express.Router();

    _router.get("/herolist", lol_herolist);

    _router.post("/addhero", lol_addhero);

    return _router;
}
