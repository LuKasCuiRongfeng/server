import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IpcChannel } from "@main/ipc";
import { Avatar, Dropdown, Menu, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { getAvatar } from "../api";

const UserSet = () => {
    const user = useAppSelector(state => state.home.user);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user.name) {
            getAvatar(user.name).then(res => {
                if (res.data.status === "success") {
                    dispatch({
                        type: "home/setUser",
                        payload: { ...user, avatar: res.data.data },
                    });
                } else {
                    message.error(res.data.error);
                }
            });
        }
    }, [user.name]);

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
                } else if (key === "set") {
                    // 创建一个 子窗口
                    window.ipcRenderer.send(IpcChannel.CREATE_WIN, {
                        key: "userset",
                        parent: "home",
                        browserWindowConstructorOptions: {
                            width: 500,
                            height: 500,
                            modal: true,
                        },
                        data: {
                            type: "userset/setUser",
                            payload: user,
                        },
                    });
                }
            }}
        />
    );
    return (
        <Dropdown overlay={menu}>
            <Avatar
                src={user.avatar}
                style={{ backgroundColor: "var(--lime-nature)" }}
            >
                {user.name?.slice(0, 3)}
            </Avatar>
        </Dropdown>
    );
};

export default UserSet;
