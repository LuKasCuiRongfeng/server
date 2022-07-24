import { usersConnection } from "../model/FullStack";
import { MiddleWare, User } from "../types";
import busboy from "busboy";
import { basename, resolve } from "path";
import { createReadStream, createWriteStream } from "fs";
import { findSockets } from "../app";
import { omit } from "lodash";

export const login: MiddleWare = async (req, res) => {
    try {
        const body = req.body as User;
        const user = await usersConnection.findOne<User>({
            name: body.name,
            password: body.password,
        });

        if (user != null) {
            res.send({
                status: "success",
                error: "",
                data: omit(user, ["password"]),
            });
            return;
        }

        res.send({ status: "failed", error: "用户名或密码错误" });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const register: MiddleWare = async (req, res) => {
    try {
        const body = req.body as User;
        const user = await usersConnection.findOne<User>({ name: body.name });

        if (user != null) {
            res.send({ status: "failed", error: "用户已经存在" });
            return;
        }
        const result = await usersConnection.insertOne({
            name: body.name,
            password: body.password,
            nickName: body.name,
            friends: [],
            strangers: [],
            avatar: "",
        });
        res.send({ status: "success", error: "", data: result.insertedId });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const friends: MiddleWare = async (req, res) => {
    try {
        const qs = req.query;
        const user = await usersConnection.findOne<User>({ name: qs.name });

        if (user != null) {
            res.send({
                status: "success",
                error: "",
                data: { friends: user.friends, strangers: user.strangers },
            });
            return;
        }
        res.send({ status: "failed", error: "用户不存在" });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const addFriendRequest: MiddleWare = async (req, res) => {
    try {
        const body = req.body;
        const friend = await usersConnection.findOne<User>({
            name: body.friend,
        });
        if (friend == null) {
            res.send({ status: "failed", error: "搜索的用户不存在" });
            return;
        }
        // 去更新朋友的陌生人列表
        await usersConnection.updateOne(
            {
                name: friend.name,
            },
            {
                $set: {
                    strangers: [...friend.strangers, body.me],
                },
            }
        );

        // 发一个消息，让对方去更新一下陌生人列表，不管在没在线
        const sockets = findSockets(friend.name);

        sockets.forEach(socket => {
            socket.emit("add-friend-request", body.me);
        });

        res.send({ status: "success", error: "" });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

// 同意后更新双方的好友表
export const permitFriend: MiddleWare = async (req, res) => {
    try {
        const { me, friend } = req.body;
        const _me = await usersConnection.findOne<User>({ name: me.name });
        const _friend = await usersConnection.findOne<User>({
            name: friend.name,
        });
        if (!_me || !_friend) {
            res.send({ status: "failed", error: "用户不存在" });
            return;
        }
        // 更新friends，并且我的陌生人列表 -1
        await usersConnection.updateOne(
            {
                name: me,
            },
            {
                $set: { friends: [..._me.friends, friend] },
            }
        );
        await usersConnection.updateOne(
            {
                name: friend.name,
            },
            {
                $set: { friends: [..._friend.friends, me] },
            }
        );
        // 发一个消息，让朋友刷新一下
        const sockets = findSockets(friend.name);
        sockets.forEach(socket => {
            socket.emit("permit-add-friend", me);
        });
        res.send({ status: "success", error: "" });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const getAvatar: MiddleWare = async (req, res) => {
    try {
        const qs = req.query;
        const user = await usersConnection.findOne<User>({ name: qs.name });

        if (user == null) {
            res.send({ status: "failed", error: "用户不存在" });
            return;
        }

        // 转base64
        const chunks = [];
        const rs = createReadStream(
            resolve(__dirname, `../public/avatar/${user.avatar}`)
        );
        rs.on("data", chunk => chunks.push(chunk))
            .on("error", err => {
                res.send({ status: "success", error: err });
            })
            .on("end", () => {
                const base64 =
                    "data:image/png;base64," +
                    Buffer.concat(chunks).toString("base64");

                res.send({ status: "success", error: "", data: base64 });
            });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const uploadAvatar: MiddleWare = async (req, res) => {
    try {
        const _busboy = busboy({ headers: req.headers });
        let filesize = 0,
            username = "",
            fileName = "";

        _busboy.on("field", (field, val, info) => {
            if (field === "filesize") {
                filesize = +val;
            } else if (field === "username") {
                username = val;
            }
        });

        _busboy.on("file", (name, file, { filename }) => {
            fileName = filename;
            const chunks = [];
            file.pipe(
                createWriteStream(
                    resolve(__dirname, "../public/avatar", fileName)
                )
            );
            file.on("data", data => {
                // 通过 socket 发送上传进度
                chunks.push(data);
                const sockets = findSockets(basename(filename, ".png"));
                sockets.forEach(el => {
                    el.emit(
                        "file-upload-progress",
                        Buffer.concat(chunks).length
                    );
                });
            })
                .on("close", () => {
                    console.log(11);
                })
                .on("error", err => console.error(err));
        });

        _busboy.on("close", async () => {
            // 更新数据库里的用户头像信息

            await usersConnection.updateOne(
                {
                    name: username,
                },
                {
                    $set: {
                        avatar: fileName,
                    },
                }
            );

            res.send({ status: "success", error: "" });
        });

        req.pipe(_busboy);
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};
