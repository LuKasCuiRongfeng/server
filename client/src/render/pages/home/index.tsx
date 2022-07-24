import { ElectronWindow } from "@/components";
import { getLocalStore } from "@/core/ipc";
import { useAppDispatch } from "@/store/hooks";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";

const Home: React.FC<Record<string, unknown>> = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        // 拿 userinfo
        getLocalStore("user").then(res => {
            dispatch({
                type: "home/setUser",
                payload: res,
            });
        });
    }, []);
    return (
        <ElectronWindow>
            <Header />
            <Outlet />
        </ElectronWindow>
    );
};

export default Home;
