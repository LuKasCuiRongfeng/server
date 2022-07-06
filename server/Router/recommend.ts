import express from "express";

export const recommendRouter = express.Router();

recommendRouter.get("/getrecommendlist", (req, res, next) => {
    res.send({
        status: "success",
        error: "",
        data: [{ content: "燃爆英超", degree: 5 }],
    });
});
