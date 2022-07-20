import socket from "@/core/socket";
import { classnames, timeFormatter } from "@/core/utils";
import { useAppSelector } from "@/store/hooks";
import { Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMemoizedFn } from "ahooks";
import dayjs, { Dayjs } from "dayjs";

type Props = {
    isPrivate: boolean;
    members: string[];
    unreadLines: Msg[];
    addUnreadLine?: (msg: Msg) => void;
};

export type Msg = {
    name: string;
    date: Dayjs;
    msg: string;
};

const Room = (props: Props) => {
    const { isPrivate, members, addUnreadLine, unreadLines } = props;
    const [msg, setMsg] = useState("");
    const [lines, setLines] = useState<Msg[]>([]);

    const { t } = useTranslation();

    const user = useAppSelector(state => state.home.user);

    const socketCb = useMemoizedFn((msg, friend) => {
        // 判断当前是否是正在聊天的对象
        console.log(members);
        if (members.includes(friend)) {
            // 是正在聊天的对象
            setLines([...lines, { name: friend, date: dayjs(), msg }]);
        } else {
            // 不是正在聊天的对象，在左边列表显示有聊天信息，设置为未读
            addUnreadLine({ name: friend, date: dayjs(), msg });
        }
    });

    useEffect(() => {
        socket.on("private-chat", socketCb);
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
                <div
                    key={line.date.toString()}
                    className={classnames(
                        "chat-right-panel-body-line",
                        "chat-right-panel-body-line-right"
                    )}
                >
                    <span
                        className={classnames(
                            "chat-right-panel-body-line-time"
                        )}
                    >
                        {timeFormatter({ dayEnd: line.date })}
                    </span>
                    <span
                        className={classnames("chat-right-panel-body-line-msg")}
                    >
                        {line.msg}
                    </span>
                </div>
            );
        }
        return (
            <div
                key={line.date.toString()}
                className={classnames("chat-right-panel-body-line")}
            >
                <span className={classnames("chat-right-panel-body-line-msg")}>
                    {line.msg}
                </span>
                <span className={classnames("chat-right-panel-body-line-time")}>
                    {timeFormatter({ dayEnd: line.date })}
                </span>
            </div>
        );
    };

    const sendMsg = (key: string) => {
        if (key.toLowerCase() === "enter") {
            socket.emit("private-chat", msg, user.name, members);
            setLines([...lines, { name: user.name, date: dayjs(), msg }]);
            setMsg("");
        }
    };
    return (
        <div className={classnames("chat-right-panel")}>
            {members.length === 0 ? (
                "什么也没有, 点击列表开始聊天吧"
            ) : (
                <>
                    <div className={classnames("chat-right-panel-send")}>
                        <Input
                            value={msg}
                            placeholder={t("发送消息")}
                            onChange={e => setMsg(e.target.value)}
                            onKeyUp={e => sendMsg(e.key)}
                            suffix={
                                <span style={{ color: "var(--gray-6)" }}>
                                    enter
                                </span>
                            }
                        />
                    </div>
                    <div className={classnames("chat-right-panel-body")}>
                        <div
                            className={classnames(
                                "chat-right-panel-body-title"
                            )}
                        >
                            {members.join(", ")}
                        </div>
                        {lines.map(line => renderMsgLine(line))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Room;
