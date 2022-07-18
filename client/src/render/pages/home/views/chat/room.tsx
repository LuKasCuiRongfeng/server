import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Room = () => {
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

    const sendMsg = (key: string) => {
        if (key.toLowerCase() === "enter") {
            socket.emit("msg", "room1", msg);
            setMsg("");
        }
    };
    return (
        <div className={classnames("chat-right-panel")}>
            <div className={classnames("chat-right-panel-send")}>
                <Input
                    value={msg}
                    placeholder={t("发送消息")}
                    onChange={e => setMsg(e.target.value)}
                    onKeyUp={e => sendMsg(e.key)}
                    suffix={
                        <span style={{ color: "var(--gray-6)" }}>enter</span>
                    }
                />
            </div>
            <div
                ref={ref}
                className={classnames("chat-right-panel-body")}
            ></div>
        </div>
    );
};

export default Room;
