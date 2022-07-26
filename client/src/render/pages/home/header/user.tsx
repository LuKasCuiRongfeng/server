import { createWin, userExit } from "@/core/ipc";
import { useAppSelector } from "@/store/hooks";
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
                        onOk: () => userExit(),
                    });
                } else if (key === "set") {
                    // 创建一个 子窗口
                    createWin({
                        key: "userset",
                        parent: "home",
                        browserWindowConstructorOptions: {
                            width: 800,
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
