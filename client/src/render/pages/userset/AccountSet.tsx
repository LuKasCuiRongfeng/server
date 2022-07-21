import { classnames } from "@/core/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IpcChannel } from "@main/ipc";
import { Avatar, message } from "antd";
import React, { useState } from "react";
import { getAvatar } from "../home/api";

const AccountSet = () => {
    const [mask, setMask] = useState(false);

    const user = useAppSelector(state => state.userset.user);

    const dispatch = useAppDispatch();

    const onClickAvatar = async () => {
        const res = await window.ipcRenderer.invoke(IpcChannel.OPEN_DIALOG, {
            filters: [
                {
                    name: "Images",
                    extensions: ["*"],
                },
            ],
            url: "/user/uploadavatar",
            name: user.name,
        });
        if (res.canceled) {
            return;
        }
        if (res.error) {
            message.error(res.error);
            return;
        }
        // 更新头像
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
