import { crossWinSendMsg, openDialog, uploadFile } from "@/core/ipc";
import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Avatar, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAvatar } from "../home/api";

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
        const res = await openDialog([
            { name: "Images", extensions: ["png", "jpg"] },
        ]);
        if (res.canceled) {
            return;
        }
        const { filepath } = res;

        const _res = await uploadFile({
            filepath,
            name: user.name,
            url: "/user/uploadavatar",
            maxSize: 100 * 1024,
        });

        if (_res.error) {
            message.error(_res.error);
            return;
        }
        const {
            data: { status, data },
        } = await getAvatar(user.name);

        if (status === "success") {
            dispatch({
                type: "userset/setUser",
                payload: { ...user, avatar: data },
            });
            // 刷新首页的头像
            await crossWinSendMsg({
                key: "home",
                data: {
                    type: "home/setUser",
                    payload: { ...user, avatar: data },
                },
            });
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
