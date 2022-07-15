import { users } from "../model/FullStack";
import { MiddleWare, User } from "../types";

export const login_login: MiddleWare = async (req, res) => {
    try {
        const body = req.body as User;
        const user = await users.findOne<User>({
            name: body.name,
            password: body.password,
        });
        if (user) {
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
};

export const login_register: MiddleWare = async (req, res) => {
    try {
        const body = req.body as User;

        const user = await users.findOne<User>({ name: body.name });
        if (user) {
            res.send({ status: "failed", error: "用户已经存在" });
        } else {
            const result = await users.insertOne(body);
            res.send({
                status: "success",
                error: "",
                data: result.insertedId,
            });
        }
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};
