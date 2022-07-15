import { lolheros } from "../model/FullStack";
import { MiddleWare, Hero } from "../types";

export const lol_herolist: MiddleWare = async (req, res) => {
    try {
        const list = await lolheros.find().toArray();
        res.send({
            status: "success",
            error: "",
            data: list,
        });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const lol_addhero: MiddleWare = async (req, res) => {
    try {
        const body = req.body as Hero;
        const result = await lolheros.insertOne(body);
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
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};
