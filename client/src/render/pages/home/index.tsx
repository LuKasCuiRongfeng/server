import { ElectronWindow } from "@/components";
import socket from "@/core/socket";
import { useAppDispatch } from "@/store/hooks";
import { IpcChannel } from "@main/ipc";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";

const Home: React.FC<Record<string, unknown>> = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        // 拿 userinfo
        window.ipcRenderer.invoke(IpcChannel.USER_INFO, "").then(res => {
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
