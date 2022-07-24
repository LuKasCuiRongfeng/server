import { ElectronWindow } from "@/components";
import { getLocalStore } from "@/core/ipc";
import { useAppDispatch } from "@/store/hooks";
import { message } from "antd";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getUser } from "./api";
import Header from "./header";

const Home: React.FC<Record<string, unknown>> = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        // 拿 userinfo
        getLocalStore("name").then(async res => {
            const {
                data: { error, data },
            } = await getUser(res);
            if (error) {
                message.error(error);
                return;
            }
            dispatch({
                type: "home/setUser",
                payload: data,
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
