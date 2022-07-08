import { ElectronWindow } from "@/components";
import { changeTheme } from "@/core/utils";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./header";

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
            <button onClick={() => changeTheme("dark")}>改变主题</button>
        </ElectronWindow>
    );
};

export default Home;
