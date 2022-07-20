import { useAppSelector } from "@/store/hooks";
import { IpcChannel } from "@main/ipc";
import { Avatar } from "antd";
import React from "react";

const AccountSet = () => {
    const user = useAppSelector(state => state.userset.user);

    console.log(user);

    const onClickAvatar = async () => {
        const filePaths = await window.ipcRenderer.invoke(
            IpcChannel.OPEN_DIALOG,
            {
                filters: [
                    {
                        name: "Images",
                        extensions: ["jpg", "png", "gif"],
                    },
                ],
                uploadURL: "http://localhost:2000/user/uploadavatar",
            }
        );
        console.log(filePaths);
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
