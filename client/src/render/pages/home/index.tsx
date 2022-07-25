import { ElectronWindow } from "@/components";
import { getLocalStore } from "@/core/ipc";
import { useChatLog } from "@/hooks";
import { useAppDispatch } from "@/store/hooks";
import { message } from "antd";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getUser } from "./api";
import Header from "./header";

const Home: React.FC<Record<string, unknown>> = () => {
    const { updateChatLog, chatLog } = useChatLog();
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

            // 同时同步本地的 聊天历史
            getLocalStore(`chatLog.${data.name}`)
                .then(res => {
                    if (res && typeof res === "object") {
                        dispatch({
                            type: "home/setChatLog",
                            payload: res,
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
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
