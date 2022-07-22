import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IpcChannel } from "@main/ipc";
import { Avatar, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAvatar } from "../home/api";
import { beforeUploadFile, uploadFile } from "./api";

const AccountSet = () => {
    const [mask, setMask] = useState(false);

    const user = useAppSelector(state => state.userset.user);

    const dispatch = useAppDispatch();

    useEffect(() => {
        socket.on("file-upload-progress", length => {
            console.log(length);
        });
        return () => {
            socket.off("file-upload-progress");
        };
    }, []);

    const onClickAvatar = async () => {
        const res = await beforeUploadFile({
            filters: [
                {
                    name: "Images",
                    extensions: ["png", "jpg"],
                },
            ],
            maxSize: 100 * 1024,
        });
        if (res.canceled || res.error) {
            res.error && message.error(res.error);
            return;
        }
        const { filepath, filesize } = res;
        console.log("filesize", filesize);
        const _res = await uploadFile({
            filepath,
            name: user.name,
            url: "/user/uploadavatar",
        });
        if (_res.status === "success") {
            const result = await getAvatar(user.name);
            if (result.data.status === "success") {
                dispatch({
                    type: "userset/setUser",
                    payload: { ...user, avatar: result.data.data },
                });
                // 刷新首页的头像
                window.ipcRenderer.send(IpcChannel.SEND_MSG, {
                    key: "home",
                    data: {
                        type: "home/setUser",
                        payload: { ...user, avatar: result.data.data },
                    },
                });
            }
        }
    };
    return (
        <div className={classnames("user-set-content-set")}>
            <div className={classnames("user-set-content-set-avatar")}>
                <Avatar
                    src={user.avatar}
                    size={80}
                    style={{ backgroundColor: "var(--lime-nature)" }}
                >
                    {user.name?.slice(0, 3)}
                </Avatar>
                <div
                    className={classnames("user-set-content-set-avatar-mask", {
                        "user-set-content-set-avatar-mask-show": mask,
                    })}
                    onMouseOver={() => setMask(true)}
                    onMouseOut={() => setMask(false)}
                    onClick={onClickAvatar}
                >
                    点击更换头像
                </div>
            </div>
        </div>
    );
};

export default AccountSet;
