import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { useAppSelector } from "@/store/hooks";
import { Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
    isPrivate: boolean;
    members: string[];
    unreadLines: Msg[];
    addUnreadLine?: (msg: Msg) => void;
};

export type Msg = {
    name: string;
    date: Date;
    msg: string;
};

const Room = (props: Props) => {
    const { isPrivate, members, addUnreadLine, unreadLines } = props;
    const [msg, setMsg] = useState("");
    const [lines, setLines] = useState<Msg[]>([]);
    const ref = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    const user = useAppSelector(state => state.home.user);

    useEffect(() => {
        socket.on("private-chat", (msg, friend) => {
            // 判断当前是否是正在聊天的对象
            if (members.includes(friend)) {
                // 是正在聊天的对象
                setLines([...lines, { name: friend, date: new Date(), msg }]);
            } else {
                // 不是正在聊天的对象，在左边列表显示有聊天信息，设置为未读
                addUnreadLine({ name: friend, date: new Date(), msg });
            }
        });
        return () => {
            socket.off("private-chat");
        };
    }, []);

    useEffect(() => {
        setLines([...lines, ...unreadLines]);
    }, [unreadLines]);

    const renderMsgLine = (line: Msg) => {
        if (line.name === user.name) {
            // 右边
            return (
                <div key={line.msg} style={{ textAlign: "right" }}>
                    <span>
                        {/* <span>{line.date.toString()}</span> */}
                        <span>{line.msg}</span>
                    </span>
                </div>
            );
        }
        return (
            <div key={line.msg} style={{ textAlign: "left" }}>
                <span>{line.msg}</span>
                {/* <span>{line.date.toString()}</span> */}
            </div>
        );
    };

    const sendMsg = (key: string) => {
        if (key.toLowerCase() === "enter") {
            socket.emit("private-chat", msg, user.name, members);
            setLines([...lines, { name: user.name, date: new Date(), msg }]);
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
            <div className={classnames("chat-right-panel-body")}>
                <div className={classnames("chat-right-panel-body-title")}>
                    {members.join(", ")}
                </div>
                {lines.map(line => renderMsgLine(line))}
            </div>
        </div>
    );
};

export default Room;
