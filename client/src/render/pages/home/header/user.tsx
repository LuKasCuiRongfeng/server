import { useAppSelector } from "@/store/hooks";
import { IpcChannel } from "@main/ipc";
import { Avatar, Dropdown, Menu, Modal } from "antd";
import React from "react";

const UserSet = () => {
    const user = useAppSelector(state => state.home.user);

    const menu = (
        <Menu
            items={[
                { label: "设置", key: "set" },
                { type: "divider" },
                { label: "EXIT", key: "EXIT" },
            ]}
            onClick={({ key }) => {
                if (key === "EXIT") {
                    Modal.confirm({
                        title: "你确定要退出登录吗?",
                        onOk: () => {
                            window.ipcRenderer.send(IpcChannel.WINDOW_LOGIN, {
                                exit: true,
                            });
                        },
                    });
                }
            }}
        />
    );
    return (
        <Dropdown overlay={menu}>
            <Avatar style={{ backgroundColor: "#87d068" }}>
                {user.name?.slice(0, 3)}
            </Avatar>
        </Dropdown>
    );
};

export default UserSet;
