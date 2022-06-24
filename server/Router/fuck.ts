import express from "express";

export const fuckRouter = express.Router();

fuckRouter.get("/", (req, res, next) => {
    console.log("/ router triggered");
    res.send("////////");
});

fuckRouter.post("/tingting", (req, res) => {
    console.log(req.body());
    res.send("/tingting");
});
