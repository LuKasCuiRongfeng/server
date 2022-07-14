import express from "express";
import { resolve } from "path";
import { App } from "../app";

type User = {
    name: string;
    password: string;
};

export function router(app: App) {
    const _router = express.Router();
    const user = app.mongoDb.connectDb("users").collection("user");

    console.log(user);

    _router.post("/login", async (req, res) => {
        try {
            const body = req.body as User;
            console.log(body);
            const existUser = await user.findOne<User>({
                name: body.name,
                password: body.password,
            });
            console.log(existUser);
            if (existUser) {
                res.send({
                    status: "success",
                    error: "",
                });
            } else {
                res.send({
                    status: "failed",
                    error: "用户名或密码错误",
                });
            }
        } catch (err) {
            res.send({ status: "failed", error: err.error });
        }
    });

    _router.post("/register", async (req, res) => {
        try {
            const body = req.body as User;

            const existUser = await user.findOne<User>({ name: body.name });
            if (existUser) {
                res.send({ status: "failed", error: "用户已经存在" });
            } else {
                const result = await user.insertOne(body);
                res.send({
                    status: "success",
                    error: "",
                    data: result.insertedId,
                });
            }
        } catch (err) {
            res.send({ status: "failed", error: err.error });
        }
    });

    app.server.use("/user", _router);
}
