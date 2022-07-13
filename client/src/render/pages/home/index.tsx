import { ElectronWindow } from "@/components";
import { changeTheme, getTheme } from "@/core/utils";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";
import Header from "./header";
import { getBigFile } from "./api";

const Home: React.FC<Record<string, unknown>> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/home", { replace: true });
        }
    }, []);
    return (
        <ElectronWindow>
            <Header />
            <Outlet />
            <button
                onClick={async () => {
                    const theme = await getTheme();
                    if (theme === "dark") {
                        await changeTheme("light");
                    } else {
                        await changeTheme("dark");
                    }
                }}
            >
                改变主题
            </button>
            <Button
                onClick={async () => {
                    const res = await getBigFile();
                    console.log(res);
                }}
            >
                获取大文件
            </Button>
        </ElectronWindow>
    );
};

export default Home;
