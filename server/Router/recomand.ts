import express from "express";

export const recomandRouter = express.Router();

recomandRouter.get("/list", (req, res, next) => {
    res.send([{ content: "英超绝杀", hot: 2 }]);
});
