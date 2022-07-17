import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { Button, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.less";

const Chat = () => {
    const [msg, setMsg] = useState("");
    const ref = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    useEffect(() => {
        socket.on("msg", (room, msg) => {
            const div = document.createElement("div");
            div.innerHTML = msg;
            div.style.textAlign = "right";
            ref.current.appendChild(div);
        });
        return () => {
            socket.off("msg");
        };
    }, []);

    const sendMsg = () => {
        socket.emit("msg", "room1", msg);
    };
    return (
        <div className={classnames("chat")}>
            <div className={classnames("chat-room")}>
                <div ref={ref} className={classnames("chat-room-body")}></div>
                <div className={classnames("chat-room-send")}>
                    <Input onChange={e => setMsg(e.target.value)} />
                    <Button onClick={() => sendMsg()}>{t("发送消息")}</Button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
