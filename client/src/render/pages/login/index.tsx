import { ElectronWindow } from "@/components";
import { classnames } from "@/core/utils";
import React from "react";
import { Outlet } from "react-router-dom";
import "./index.less";

const Login: React.FC<Record<string, any>> = () => {
    return (
        <ElectronWindow>
            <div className={classnames("login")}>
                <div className={classnames("login-introduce")}></div>
                <div className={classnames("login-operation")}>
                    <div className={classnames("login-operation-title")}>
                        <h3>立即登录</h3>
                        <span>精彩赛事一手掌握</span>
                    </div>
                    <Outlet />
                </div>
            </div>
        </ElectronWindow>
    );
};

export default Login;
