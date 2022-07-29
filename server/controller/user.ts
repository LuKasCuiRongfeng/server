import { usersConnection } from "../model/FullStack";
import { MiddleWare, Stranger, User } from "../types";
import busboy from "busboy";
import { basename, extname, resolve } from "path";
import { createReadStream, createWriteStream } from "fs";
import { findSockets } from "../app";
import { createHmac } from "crypto";

export const login: MiddleWare = async (req, res) => {
    try {
        const body = req.body as User;
        // 判断一下是否在其他地方已经登录了
        const sockets = findSockets(body.name);
        if (sockets.length > 1) {
            // 你的账号正在被登录
            res.send({
                status: "failed",
                error: "你的账号已在其他地方登录, 已被占用",
            });
            return;
        }
        const user = await usersConnection.findOne<User>({
            name: body.name,
            password: body.password,
        });

        if (user != null) {
            // 登录页只返回 name，其他量需要调用接口去请求
            res.send({
                status: "success",
                error: "",
                data: user.name,
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

export const getUser: MiddleWare = async (req, res) => {
    try {
        const { name } = req.query;
        const user = await usersConnection.findOne<User>({ name });

        if (user != null) {
            const { name, nickName, friends, strangers, avatar } = user;

            // avatar 转 base64
            const chunks = [];
            const rs = createReadStream(
                resolve(__dirname, `../public/usercache/${avatar}`)
            );
            rs.on("data", chunk => chunks.push(chunk))
                .on("error", err => {
                    res.send({
                        status: "success",
                        error: "",
                        data: {
                            name,
                            nickName,
                            friends,
                            strangers,
                            avatar: "",
                        },
                    });
                })
                .on("end", () => {
                    const base64 =
                        "data:image/png;base64," +
                        Buffer.concat(chunks).toString("base64");

                    res.send({
                        status: "success",
                        error: "",
                        data: {
                            name,
                            nickName,
                            friends,
                            strangers,
                            avatar: base64,
                        },
                    });
                });
        } else {
            res.send({ status: "failed", error: "用户不存在" });
        }
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const updateUser: MiddleWare = async (req, res) => {
    try {
        const { name, nickName, friends, strangers, avatar, password } =
            req.body as User;
        const user = await usersConnection.findOne<User>({ name });

        if (user != null) {
            await usersConnection.updateOne(
                {
                    name,
                },
                {
                    $set: {
                        nickName: nickName ?? user.nickName,
                        friends: friends ?? user.friends,
                        strangers: strangers ?? user.strangers,
                        avatar: avatar ?? user.avatar,
                        password: password ?? user.password,
                    },
                }
            );
            res.send({ status: "success", error: "" });
        } else {
            res.send({ status: "failed", error: "用户不存在" });
        }
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const addFriendRequest: MiddleWare = async (req, res) => {
    try {
        const { friend, me } = req.body as { friend: string; me: Stranger };

        const _friend = await usersConnection.findOne<User>({
            name: friend,
        });
        if (_friend == null) {
            res.send({ status: "failed", error: "搜索的用户不存在" });
            return;
        }
        // 去更新朋友的陌生人列表
        const find = _friend.strangers.find(el => el.name === me.name);
        if (!find) {
            await usersConnection.updateOne(
                {
                    name: friend,
                },
                {
                    $set: {
                        strangers: [me, ..._friend.strangers],
                    },
                }
            );
        }

        // 发一个消息，让对方去更新一下陌生人列表，不管在没在线
        const sockets = findSockets(friend);

        sockets.forEach(socket => {
            socket.emit("add-friend-request", me);
        });

        res.send({ status: "success", error: "" });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

// 同意后更新双方的好友表
export const permitFriend: MiddleWare = async (req, res) => {
    try {
        const { me, friend } = req.body as { me: string; friend: string };
        const _me = await usersConnection.findOne<User>({ name: me });
        const _friend = await usersConnection.findOne<User>({
            name: friend,
        });
        if (!_me || !_friend) {
            res.send({ status: "failed", error: "用户不存在" });
            return;
        }
        // 更新friends，并且我的陌生人列表 -1
        const strangers = _me.strangers.filter(el => el.name !== friend);

        await usersConnection.updateOne(
            {
                name: me,
            },
            {
                $set: { friends: [friend, ..._me.friends], strangers },
            }
        );
        await usersConnection.updateOne(
            {
                name: friend,
            },
            {
                $set: { friends: [me, ..._friend.friends] },
            }
        );
        // 发一个消息，让朋友刷新一下
        const sockets = findSockets(friend);

        sockets.forEach(socket => {
            socket.emit("permit-add-friend", me);
        });
        res.send({ status: "success", error: "" });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

// 上传文件的标准模型是根据文件的上传时间+文件名+上传人生成一个
// 特有的哈希值作为新的文件名，并把新的文件名返回给前端，其他
// 的事就不要做了
export const uploadFile: MiddleWare = async (req, res) => {
    try {
        const _busboy = busboy({ headers: req.headers });
        let username = "",
            newFilename = "",
            originFilename = "";

        _busboy.on("field", (field, val, info) => {
            if (field === "username") {
                username = val;
            }
        });

        _busboy.on("file", (name, file, { filename }) => {
            const ext = extname(filename);
            // 原始文件名 + 时间生成一个新的 hash 文件名
            newFilename =
                createHmac("sha256", filename + Date.now()).digest("hex") + ext;
            const chunks = [];
            // 通过 socket 发送上传进度
            // 由于在这个地方拿不到 username，
            // 又需要 username去找 socket，我操
            // 只能采取分割形式，需要前端把上传的文件名
            // 改成 username = filename，比如 crf?猴子.jpg
            const sockets = findSockets(filename.split("?")[0]);
            originFilename = filename.split("?")[1];
            const writeStream = createWriteStream(
                resolve(__dirname, "../public/usercache", newFilename)
            );

            file.pipe(writeStream);

            file.on("data", data => {
                console.log(data.length);
                chunks.push(data);
                sockets.forEach(el => {
                    el.emit(
                        "file-upload-progress",
                        newFilename,
                        Buffer.concat(chunks).length
                    );
                });
            });
        });

        _busboy.on("close", async () => {
            // 把生成的 hash 新文件发回来
            res.send({
                status: "success",
                error: "",
                data: { newFilename, originFilename },
            });
        });

        req.pipe(_busboy);
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};

export const deleteFriend: MiddleWare = async (req, res) => {
    try {
        const body = req.body as { me: string; friend: string };
        const me = await usersConnection.findOne<User>({ name: body.me });
        const friend = await usersConnection.findOne<User>({
            name: body.friend,
        });

        if (me == null || friend == null) {
            res.send({ status: "failed", error: "用户不存在存在" });
            return;
        }
        const filters1 = friend.friends.filter(el => el !== body.me);
        const filters2 = me.friends.filter(el => el !== body.friend);
        await usersConnection.updateOne(
            {
                name: body.friend,
            },
            {
                $set: {
                    friends: [...filters1],
                },
            }
        );
        await usersConnection.updateOne(
            {
                name: body.me,
            },
            {
                $set: {
                    friends: [...filters2],
                },
            }
        );
        res.send({ status: "success", error: "" });
    } catch (err) {
        res.send({ status: "failed", error: err.error });
    }
};
