import React, { useEffect, useState } from "react";
import { ElectronWindow } from "@/components";
import { classnames } from "@/core/utils";
import { Menu, MenuProps } from "antd";
import "./index.less";
import AccountSet from "./AccountSet";

const UserSet = () => {
    const [selectedKey, setSelectedKey] = useState("account-set");
    const menuItems: MenuProps["items"] = [
        {
            label: "账号设置",
            key: "account-set",
        },
        {
            label: "账号安全",
            key: "account-security",
        },
    ];

    const renderContent = (key: string) => {
        if (key === "account-set") {
            return <AccountSet />;
        }
        return <div>什么也没有</div>;
    };
    return (
        <ElectronWindow>
            <div className={classnames("user-set")}>
                <div className={classnames("user-set-menu")}>
                    <Menu
                        onClick={({ key }) => setSelectedKey(key)}
                        defaultSelectedKeys={[selectedKey]}
                        items={menuItems}
                    />
                </div>
                <div className={classnames("user-set-content")}>
                    {renderContent(selectedKey)}
                </div>
            </div>
        </ElectronWindow>
    );
};

export default UserSet;
