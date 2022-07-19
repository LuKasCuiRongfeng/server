import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { useAppSelector } from "@/store/hooks";
import { Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
    isPrivate: boolean;
    members: string[];
    setUnread?: (name: string, msg: string) => void;
};

const Room = (props: Props) => {
    const { isPrivate, members } = props;
    const [msg, setMsg] = useState("");
    const ref = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    const user = useAppSelector(state => state.home.user);

    useEffect(() => {
        socket.on("private-chat", (msg, friend) => {
            // 判断当前是否是正在聊天的对象
            if (members.includes(friend)) {
                // 是正在聊天的对象
                const div = document.createElement("div");
                div.innerHTML = msg;
                div.style.textAlign = "right";
                ref.current.appendChild(div);
            } else {
                // 不是正在聊天的对象，在左边列表显示有聊天信息
            }
        });
        return () => {
            socket.off("msg");
        };
    }, []);

    const sendMsg = (key: string) => {
        if (key.toLowerCase() === "enter") {
            socket.emit("private-chat", msg, user.name, members);
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
            <div ref={ref} className={classnames("chat-right-panel-body")}>
                <div className={classnames("chat-right-panel-body-title")}>
                    {members.join(", ")}
                </div>
            </div>
        </div>
    );
};

export default Room;
