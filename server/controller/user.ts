import { createHmac } from "crypto";
import { usersConnection } from "../model/FullStack";
import { MiddleWare, User } from "../types";

export const login: MiddleWare = async (req, res) => {
    try {
        const body = req.body as User;
        const user = await usersConnection.findOne<User>({
            name: body.name,
            password: body.password,
        });
        if (user) {
            res.send({
                status: "success",
                error: "",
                // 登录成功返回sessionID name
                data: { userId: user.userId, name: user.name },
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

export const register: MiddleWare = async (req, res) => {
    try {
        const body = req.body as User;

        const user = await usersConnection.findOne<User>({ name: body.name });
        if (user) {
            res.send({ status: "failed", error: "用户已经存在" });
        } else {
            const result = await usersConnection.insertOne({
                ...body,
                userId: createHmac("sha256", body.name).digest("hex"),
                friends: [],
            });
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

export const friends: MiddleWare = async (req, res) => {
    try {
        const qs = req.query;

        const user = await usersConnection.findOne<User>({ name: qs.name });
        if (user) {
            res.send({
                status: "success",
                error: "",
                data: user.friends,
            });
        } else {
            res.send({
                status: "failed",
                error: "用户不存在",
            });
        }
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const addFriend: MiddleWare = async (req, res) => {
    try {
        const qs = req.query;
        const friend = await usersConnection.findOne<User>({
            name: qs.friend,
        });
        if (friend) {
            const me = await usersConnection.findOne<User>({
                name: qs.me,
            });
            // 更新friends
            await usersConnection.updateOne(
                {
                    name: qs.me,
                },
                {
                    $set: {
                        friends: [...me.friends, qs.friend as string],
                    },
                }
            );
            res.send({
                status: "success",
                error: "",
            });
        } else {
            res.send({
                status: "failed",
                error: "用户不存在",
            });
        }
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};
