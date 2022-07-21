import { HOST } from "@/core/const";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IpcChannel } from "@main/ipc";
import { Avatar } from "antd";
import React from "react";
import { getAvatar } from "../home/api";

const AccountSet = () => {
    const user = useAppSelector(state => state.userset.user);

    console.log(user);

    const dispatch = useAppDispatch();

    const onClickAvatar = async () => {
        const filePaths = await window.ipcRenderer.invoke(
            IpcChannel.OPEN_DIALOG,
            {
                filters: [
                    {
                        name: "Images",
                        extensions: ["*"],
                    },
                ],
                url: "/user/uploadavatar",
                name: user.name,
            }
        );
        // 更新头像
        const res = await getAvatar(user.name);
        if (res.data.status === "success") {
            dispatch({
                type: "userset/setUser",
                payload: { ...user, avatar: `http://${HOST}${res.data.data}` },
            });
        }
    };
    return (
        <div>
            <Avatar
                src={user.avatar}
                size={100}
                style={{ backgroundColor: "var(--lime-nature)" }}
            >
                {user.name?.slice(0, 3)}
            </Avatar>
            <span onClick={onClickAvatar}>点击更换头像</span>
        </div>
    );
};

export default AccountSet;
